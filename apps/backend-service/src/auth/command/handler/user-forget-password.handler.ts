import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UserForgetPasswordCommand } from '@backend/auth/command/impl/user-forget-password.impl';
import { AuthRepository } from '@backend/auth/repository/auth.repository';
import { HttpResponse } from '@common/helpers/http-response';
import { authModelInstance } from '@backend/auth/model/auth.model';

@CommandHandler(UserForgetPasswordCommand)
export class UserForgetPasswordHandler
  implements ICommandHandler<UserForgetPasswordCommand>
{
  constructor(
    private readonly publisher: EventPublisher,
    private readonly authRepository: AuthRepository,
  ) {}

  async execute(command: UserForgetPasswordCommand) {
    const { query } = command;

    const authContext = this.publisher.mergeObjectContext(authModelInstance);

    const findUser = await this.authRepository.findUserByEmail(query.email);

    if (!findUser) {
      return new HttpResponse(200, {
        message:
          'Please check your email for your OTP code to reset your password',
      });
    }

    const forgotPassword = await this.authRepository.forgotPassword(
      query.email,
    );

    authContext.userForgotPassword(
      forgotPassword.User.email,
      forgotPassword.User.fullName,
      forgotPassword.User.OneTimePassword.code,
    );
    authContext.commit();

    return new HttpResponse(200, {
      message:
        'Please check your email for your OTP code to reset your password',
    });
  }
}
