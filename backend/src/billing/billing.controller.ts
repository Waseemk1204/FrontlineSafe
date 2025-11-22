import {
  Controller,
  Post,
  Body,
  Headers,
  RawBodyRequest,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

class CreateCustomerDto {
  email: string;
}

class CreateSubscriptionDto {
  planId: string;
  paymentMethodId: string;
}

@ApiTags('billing')
@Controller('billing')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BillingController {
  private stripe: Stripe | null;

  constructor(
    private readonly billingService: BillingService,
    private readonly configService: ConfigService,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
  ) {
    const stripeConfig = this.configService.get('stripe');
    // Only initialize Stripe if secret key is provided
    if (stripeConfig?.secretKey) {
      this.stripe = new Stripe(stripeConfig.secretKey);
    } else {
      console.warn('Stripe secret key not provided in BillingController. Billing features will be disabled.');
      this.stripe = null;
    }
  }

  @Post('create-customer')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create Stripe customer' })
  @ApiResponse({ status: 201, description: 'Customer created' })
  async createCustomer(@Body() dto: CreateCustomerDto, @CurrentUser() user: any) {
    return this.billingService.createCustomer(user.companyId, dto.email);
  }

  @Post('create-subscription')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create subscription' })
  @ApiResponse({ status: 201, description: 'Subscription created' })
  async createSubscription(@Body() dto: CreateSubscriptionDto, @CurrentUser() user: any) {
    return this.billingService.createSubscription(user.companyId, dto.planId, dto.paymentMethodId);
  }

  @Post('webhooks/stripe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Stripe webhook handler' })
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not configured. Please set STRIPE_SECRET_KEY.');
    }

    const stripeConfig = this.configService.get('stripe');
    const webhookSecret = stripeConfig.webhookSecret;

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.rawBody as Buffer,
        signature,
        webhookSecret,
      );
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    // Process webhook asynchronously via job queue
    await this.notificationsQueue.add('stripe-webhook', {
      eventType: event.type,
      eventData: event.data,
    });

    return { received: true };
  }
}

