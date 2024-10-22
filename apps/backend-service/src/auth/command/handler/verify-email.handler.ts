import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { VerifyEmailCommand } from '@backend/auth/command/impl/verify-email.impl';
import { authModelInstance } from '@backend/auth/model/auth.model';
import { AuthRepository } from '@backend/auth/repository/auth.repository';
import { BadRequestException } from '@nestjs/common';
import { HttpResponse } from '@common/helpers/http-response';
import { isAfter } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly authRepository: AuthRepository,
  ) {}

  async execute(command: VerifyEmailCommand) {
    const { otpCode, email } = command;

    const authModelContext =
      this.publisher.mergeObjectContext(authModelInstance);

    const checkOtpCode = await this.authRepository.checkOtpCode(otpCode, email);

    if (!checkOtpCode) {
      return new BadRequestException('Invalid OTP code or email.');
    }

    const userID = checkOtpCode.User.id;

    if (
      isAfter(
        toZonedTime(new Date(), 'Europe/Istanbul'),
        checkOtpCode.expiresAt,
      )
    ) {
      return new BadRequestException('OTP code has expired.');
    }

    await this.authRepository.completeVerifyEmail(userID);

    authModelContext.verifiedEmail(userID);
    authModelContext.commit();

    return new HttpResponse(200, {
      message: 'Email verified successfully',
    });
  }
}
