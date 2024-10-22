import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UserResetPasswordCommand } from '@backend/auth/command/impl/user-reset-password.impl';
import { AuthRepository } from '@backend/auth/repository/auth.repository';
import { HttpResponse } from '@common/helpers/http-response';
import { BadRequestException } from '@nestjs/common';
import { isAfter } from 'date-fns';
import { authModelInstance } from '@backend/auth/model/auth.model';
import HashManager from '@common/helpers/hash-manager';
import { toZonedTime } from 'date-fns-tz';
@CommandHandler(UserResetPasswordCommand)
export class UserResetPasswordHandler
  implements ICommandHandler<UserResetPasswordCommand>
{
  constructor(
    private readonly publisher: EventPublisher,
    private readonly authRepository: AuthRepository,
  ) {}

  async execute(command: UserResetPasswordCommand) {
    const {
      body: { email, otpCode, newPassword, newPasswordConfirmation },
    } = command;

    const authContext = this.publisher.mergeObjectContext(authModelInstance);

    const checkOtpCode = await this.authRepository.checkOtpCode(otpCode, email);

    if (!checkOtpCode) {
      return new BadRequestException('Invalid OTP code or email');
    }

    if (
      isAfter(
        toZonedTime(new Date(), 'Europe/Istanbul'),
        checkOtpCode.expiresAt,
      )
    ) {
      return new BadRequestException(
        'OTP code has been expired. Please request a new one',
      );
    }

    if (
      await HashManager.comparePassword(newPassword, checkOtpCode.User.password)
    ) {
      return new BadRequestException(
        'New password cannot be the same as the old password',
      );
    }

    const updatePassword = await this.authRepository.updateUserPassword(
      checkOtpCode.User.id,
      newPassword,
      true,
    );

    authContext.userPasswordResetCompleted(
      updatePassword.email,
      updatePassword.fullName,
      updatePassword.updatedAt,
    );
    authContext.commit();

    return new HttpResponse(200, {
      message: 'Password has been reset successfully',
    });
  }
}
