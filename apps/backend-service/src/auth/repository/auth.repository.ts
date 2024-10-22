import { Injectable } from '@nestjs/common';
import Generator from '@common/helpers/generator';
import { omit } from 'lodash';
import { PrismaService } from '@common/modules/prisma/prisma.service';
import HashManager from '@common/helpers/hash-manager';
import { UserSigninBodyDto, UserSignupBodyDto } from '../dtos';
import { addHours, addMinutes } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Create a new user
   */
  async signupUser(signupBody: UserSignupBodyDto) {
    const hashedPassword = await HashManager.hashPassword(signupBody.password);

    const userCode = Generator.random(10, 'numeric');

    const otpCode = Generator.random(6, 'numeric');
    const now = toZonedTime(new Date(), 'Europe/Istanbul');

    return await this.prismaService.user.create({
      data: {
        fullName: `${signupBody.firstName} ${signupBody.lastName}`,
        userCode: userCode,
        password: hashedPassword,
        createdAt: now,
        email: signupBody.email,
        phone: signupBody.phone,
        updatedAt: now,

        OneTimePassword: {
          create: {
            code: otpCode,
            expiresAt: addMinutes(now, 15),
            createdAt: now,
          },
        },
        ...omit(signupBody, ['email', 'phone', 'password']),
      },
      include: {
        OneTimePassword: true,
      },
    });
  }

  /**
   * Find a user by email with email type
   */
  async findUserByEmail(email: string) {
    return await this.prismaService.user.findFirst({
      where: {
        email,
      },
      include: {
        OneTimePassword: true,
      },
    });
  }

  /**
   * Check if a verification token exists
   */
  async checkOtpCode(otpCode: number, email: string) {
    return await this.prismaService.oneTimePassword.findFirst({
      where: {
        User: {
          email,
        },
        code: otpCode,
      },
      include: {
        User: {
          select: {
            email: true,
            id: true,
            OneTimePassword: true,
            password: true,
          },
        },
      },
    });
  }

  /**
   * Complete email verification
   */
  async completeVerifyEmail(userID: number) {
    const now = toZonedTime(new Date(), 'Europe/Istanbul');

    await this.prismaService.$transaction(async (prismaService) => {
      await this.prismaService.user.update({
        where: {
          id: userID,
        },
        data: {
          isEmailVerified: true,
          verifiedAt: now,
          updatedAt: now,
          OneTimePassword: {
            delete: true,
          },
        },
      });
    });
  }

  /**
   * Signin a user
   */
  async signinUser(signinBody: UserSigninBodyDto) {
    return await this.prismaService.user.findFirst({
      where: {
        email: signinBody.email,
      },
      include: {
        OneTimePassword: true,
        BlockedUser: true,
      },
    });
  }

  /**
   * Forgot password
   */
  async forgotPassword(email: string) {
    const otpCode = Generator.random(6, 'numeric');

    return await this.prismaService.$transaction(async (prismaService) => {
      const findUser = await this.prismaService.user.findFirst({
        where: {
          email,
        },
      });

      return await this.prismaService.oneTimePassword.create({
        data: {
          code: otpCode,
          createdAt: toZonedTime(new Date(), 'Europe/Istanbul'),
          expiresAt: addMinutes(toZonedTime(new Date(), 'Europe/Istanbul'), 15),
          User: {
            connect: {
              id: findUser.id,
            },
          },
        },
        include: {
          User: {
            include: {
              OneTimePassword: true,
            },
          },
        },
      });
    });
  }

  /**
   * Update user password
   */
  async updateUserPassword(
    userID: number,
    newPassword: string,
    oneTimePasswordDelete: boolean,
  ) {
    const hashedPassword = await HashManager.hashPassword(newPassword);

    return await this.prismaService.user.update({
      where: {
        id: userID,
      },
      data: {
        password: hashedPassword,
        updatedAt: toZonedTime(new Date(), 'Europe/Istanbul'),
        ...(oneTimePasswordDelete && {
          OneTimePassword: {
            delete: true,
          },
        }),
      },
    });
  }

  /**
   * increment user failed login attempts
   */
  async incrementFailedLoginAttempts(userID: number) {
    return await this.prismaService.user.update({
      where: {
        id: userID,
      },
      data: {
        failedLoginAttempts: {
          increment: 1,
        },
      },
    });
  }

  /**
   * Reset user failed login attempts
   */
  async resetFailedLoginAttempts(userID: number) {
    return await this.prismaService.user.update({
      where: {
        id: userID,
      },
      data: {
        failedLoginAttempts: 0,
      },
    });
  }

  /**
   * Block User
   */
  async blockUserAsTemprorary(userID: number) {
    return await this.prismaService.user.update({
      where: {
        id: userID,
      },
      data: {
        BlockedUser: {
          create: {
            blockedAt: toZonedTime(new Date(), 'Europe/Istanbul'),
            blockedUntil: addHours(
              toZonedTime(new Date(), 'Europe/Istanbul'),
              1,
            ),
            reason: 'TOO_MANY_FAILED_ATTEMPTS',
          },
        },
        status: 'TEMPORARY_BLOCKED',
      },
    });
  }
}
