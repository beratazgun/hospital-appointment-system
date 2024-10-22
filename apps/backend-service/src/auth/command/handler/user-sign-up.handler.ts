import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UserSignUpCommand } from '@backend/auth/command/impl/user-sign-up.impl';
import { ConflictException } from '@nestjs/common';
import { HttpResponse } from '@common/helpers/http-response';
import { authModelInstance } from '@backend/auth/model/auth.model';
import { AuthRepository } from '@backend/auth/repository/auth.repository';

@CommandHandler(UserSignUpCommand)
export class UserSignUpHandler implements ICommandHandler<UserSignUpCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly authRepository: AuthRepository,
  ) {}

  async execute(command: UserSignUpCommand) {
    const { body } = command;

    const authModelContext =
      this.publisher.mergeObjectContext(authModelInstance);

    const checkUserEmail = await this.authRepository.findUserByEmail(
      body.email,
    );

    if (checkUserEmail) {
      return new ConflictException('User with this email already exists');
    }

    const createdUser = await this.authRepository.signupUser(body);

    authModelContext.signedUpUser({
      ...createdUser,
      oneTimePasswords: createdUser.OneTimePassword,
    });
    authModelContext.commit();

    return new HttpResponse(201, {
      message: 'User signed up successfully. Please verify your email',
      redirect: 'OTP',
      otpPayload: {
        expiresAt: createdUser.OneTimePassword.expiresAt,
        email: createdUser.email,
      },
    });
  }
}
