import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { InviteUserDto } from './dto/invite-user.dto';
import { UserRole } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    // private readonly notificationsService: NotificationsService,
  ) { }

  async signup(signupDto: SignupDto) {
    const { companyName, email, name, password } = signupDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create company and user in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name: companyName,
          plan: 'Starter',
          subscriptionStatus: 'trialing',
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
        },
      });

      const user = await tx.user.create({
        data: {
          companyId: company.id,
          email,
          name,
          password: hashedPassword,
          role: UserRole.ADMIN, // First user is admin
        },
      });

      return { company, user };
    });

    // Generate tokens
    const tokens = await this.generateTokens(result.user);

    return {
      companyId: result.company.id,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
      tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { company: true },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
      tokens,
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto, cookieToken?: string) {
    const token = refreshTokenDto.refreshToken || cookieToken;

    if (!token) {
      throw new UnauthorizedException('Refresh token is required');
    }

    // Find refresh token in database
    const refreshTokenRecord = await this.prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!refreshTokenRecord) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: refreshTokenRecord.userId },
      include: { company: true },
    });

    if (refreshTokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Generate new tokens
    const tokens = await this.generateTokens(user);

    // Delete old refresh token
    await this.prisma.refreshToken.delete({
      where: { id: refreshTokenRecord.id },
    });

    return tokens;
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Don't reveal if user exists
    if (!user) {
      return { message: 'If the email exists, a password reset link has been sent' };
    }

    // Generate reset token
    const resetToken = uuidv4();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store token (in a real app, you'd use a separate PasswordResetToken table)
    // For now, we'll use a simple approach with the audit log or a temp field
    // In production, create a PasswordResetToken model

    // Send email
    // await this.notificationsService.sendPasswordResetEmail(user.email, resetToken);

    return { message: 'If the email exists, a password reset link has been sent' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword } = resetPasswordDto;

    // In production, verify token from PasswordResetToken table
    // For now, this is a placeholder - you'd need to implement token storage
    throw new BadRequestException('Password reset not fully implemented - requires token storage');
  }

  async inviteUsers(companyId: string, inviterId: string, inviteDto: InviteUserDto) {
    const { emails, role } = inviteDto;

    const invites = await Promise.all(
      emails.map(async (email) => {
        // Check if user already exists
        const existingUser = await this.prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          return { email, status: 'exists', message: 'User already exists' };
        }

        // Check if invite already exists
        const existingInvite = await this.prisma.invite.findUnique({
          where: {
            companyId_email: {
              companyId,
              email,
            },
          },
        });

        if (existingInvite && !existingInvite.acceptedAt) {
          return { email, status: 'pending', message: 'Invite already sent' };
        }

        // Create invite
        const token = uuidv4();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        const invite = await this.prisma.invite.create({
          data: {
            companyId,
            email,
            token,
            role,
            invitedBy: inviterId,
            expiresAt,
          },
        });

        // Send invite email
        // await this.notificationsService.sendInviteEmail(email, token, companyId);

        return { email, status: 'sent', inviteId: invite.id };
      }),
    );

    return {
      message: 'Invites processed',
      invites,
    };
  }

  async acceptInvite(token: string, name: string, password: string) {
    const invite = await this.prisma.invite.findUnique({
      where: { token },
    });

    if (!invite) {
      throw new NotFoundException('Invalid invite token');
    }

    const company = await this.prisma.company.findUnique({
      where: { id: invite.companyId },
    });

    if (invite.expiresAt < new Date()) {
      throw new BadRequestException('Invite token has expired');
    }

    if (invite.acceptedAt) {
      throw new BadRequestException('Invite has already been accepted');
    }

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: invite.email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and mark invite as accepted
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          companyId: invite.companyId,
          email: invite.email,
          name,
          password: hashedPassword,
          role: invite.role,
        },
      });

      await tx.invite.update({
        where: { id: invite.id },
        data: { acceptedAt: new Date() },
      });

      return user;
    });

    // Generate tokens
    const tokens = await this.generateTokens(result);

    return {
      user: {
        id: result.id,
        name: result.name,
        email: result.email,
        role: result.role,
        companyId: result.companyId,
      },
      tokens,
    };
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await this.prisma.refreshToken.deleteMany({
        where: {
          userId,
          token: refreshToken,
        },
      });
    } else {
      // Delete all refresh tokens for user
      await this.prisma.refreshToken.deleteMany({
        where: { userId },
      });
    }

    return { message: 'Logged out successfully' };
  }

  private async generateTokens(user: any) {
    const jwtConfig = this.configService.get('jwt');

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: jwtConfig.secret,
      expiresIn: jwtConfig.expiresIn,
    });

    const refreshToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    // Store refresh token in database
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  // SSO Placeholders
  async ssoSaml() {
    const samlEntityId = this.configService.get('sso.samlEntityId');
    if (!samlEntityId) {
      throw new BadRequestException('SAML SSO is not configured');
    }
    // In production, implement SAML flow
    throw new BadRequestException('SAML SSO not implemented');
  }

  async ssoOAuth() {
    const oauthClientId = this.configService.get('sso.oauthClientId');
    if (!oauthClientId) {
      throw new BadRequestException('OAuth SSO is not configured');
    }
    // In production, implement OAuth flow
    throw new BadRequestException('OAuth SSO not implemented');
  }
}

