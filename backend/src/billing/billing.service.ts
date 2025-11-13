import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';
import { SubscriptionPlan } from '@prisma/client';

@Injectable()
export class BillingService {
  private stripe: Stripe | null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const stripeConfig = this.configService.get('stripe');
    // Only initialize Stripe if secret key is provided
    if (stripeConfig?.secretKey) {
      this.stripe = new Stripe(stripeConfig.secretKey);
    } else {
      console.warn('Stripe secret key not provided. Billing features will be disabled.');
      this.stripe = null;
    }
  }

  async createCustomer(companyId: string, email: string) {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not configured. Please set STRIPE_SECRET_KEY.');
    }

    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new BadRequestException('Company not found');
    }

    if (company.stripeCustomerId) {
      return { customerId: company.stripeCustomerId, existing: true };
    }

    const customer = await this.stripe.customers.create({
      email,
      metadata: {
        companyId,
      },
    });

    await this.prisma.company.update({
      where: { id: companyId },
      data: { stripeCustomerId: customer.id },
    });

    return { customerId: customer.id, existing: false };
  }

  async createSubscription(companyId: string, planId: string, paymentMethodId: string) {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not configured. Please set STRIPE_SECRET_KEY.');
    }

    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new BadRequestException('Company not found');
    }

    // Get or create customer
    let customerId = company.stripeCustomerId;
    if (!customerId) {
      const user = await this.prisma.user.findFirst({
        where: { companyId },
      });
      if (user) {
        const customerResult = await this.createCustomer(companyId, user.email);
        customerId = customerResult.customerId;
      }
    }

    if (!customerId) {
      throw new BadRequestException('Customer not found or created');
    }

    // Attach payment method
    await this.stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Set as default
    await this.stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Create subscription
    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: planId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    // Update company
    await this.prisma.company.update({
      where: { id: companyId },
      data: {
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: subscription.status === 'active' ? 'active' : 'trialing',
      },
    });

    // Create subscription record
    await this.prisma.subscription.create({
      data: {
        companyId,
        stripeSubscriptionId: subscription.id,
        plan: this.mapStripePlanToDbPlan(planId),
        status: subscription.status as any,
        currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      },
    });

    return {
      subscriptionId: subscription.id,
      clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
    };
  }

  async handleWebhook(event: Stripe.Event) {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not configured. Please set STRIPE_SECRET_KEY.');
    }

    switch (event.type) {
      case 'invoice.paid':
        await this.handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      case 'invoice.payment_failed':
        await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.updated':
        await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
    }
  }

  private async handleInvoicePaid(invoice: Stripe.Invoice) {
    const subscriptionId = (invoice as any).subscription;
    
    if (subscriptionId) {
      const subId = typeof subscriptionId === 'string' ? subscriptionId : subscriptionId.id;
      const subscription = await this.prisma.subscription.findUnique({
        where: { stripeSubscriptionId: subId },
      });

      if (subscription) {
        await this.prisma.company.update({
          where: { id: subscription.companyId },
          data: { subscriptionStatus: 'active' },
        });
      }
    }
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    const subscriptionId = (invoice as any).subscription;
    
    if (subscriptionId) {
      const subId = typeof subscriptionId === 'string' ? subscriptionId : subscriptionId.id;
      const subscription = await this.prisma.subscription.findUnique({
        where: { stripeSubscriptionId: subId },
      });

      if (subscription) {
        await this.prisma.company.update({
          where: { id: subscription.companyId },
          data: { subscriptionStatus: 'past_due' },
        });
      }
    }
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const sub = await this.prisma.subscription.findUnique({
      where: { stripeSubscriptionId: subscription.id },
    });

    if (sub) {
      await this.prisma.company.update({
        where: { id: sub.companyId },
        data: {
          subscriptionStatus: 'canceled',
          stripeSubscriptionId: null,
        },
      });
    }
  }

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const sub = await this.prisma.subscription.findUnique({
      where: { stripeSubscriptionId: subscription.id },
    });

    if (sub) {
      await this.prisma.subscription.update({
        where: { id: sub.id },
        data: {
          status: subscription.status as any,
          currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
          currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        },
      });

      await this.prisma.company.update({
        where: { id: sub.companyId },
        data: {
          subscriptionStatus: subscription.status as any,
        },
      });
    }
  }

  private mapStripePlanToDbPlan(planId: string): SubscriptionPlan {
    // This would map Stripe plan IDs to your internal plan enum
    // For now, return a default
    if (planId.includes('starter')) return 'Starter';
    if (planId.includes('growth')) return 'Growth';
    if (planId.includes('enterprise')) return 'Enterprise';
    return 'Starter';
  }
}

