import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UserUpdatePasswordCommand } from '@backend/auth/command/impl/user-update-password.impl';
import { HttpResponse } from '@common/helpers/http-response';
import { AuthRepository } from '@backend/auth/repository/auth.repository';
import { authModelInstance } from '@backend/auth/model/auth.model';

@CommandHandler(UserUpdatePasswordCommand)
export class UserUpdatePasswordHandler
  implements ICommandHandler<UserUpdatePasswordCommand>
{
  constructor(
    private readonly publisher: EventPublisher,
    private readonly authRepository: AuthRepository,
  ) {}

  async execute(command: UserUpdatePasswordCommand) {
    const { body, req } = command;
    const { oldPassword, newPassword, newPasswordConfirmation } = body;

    if (oldPassword === newPassword) {
      return new HttpResponse(400, {
        message: 'Old password and new password must be different',
      });
    }

    const updatePassword = await this.authRepository.updateUserPassword(
      req.session.user.id,
      newPassword,
      false,
    );

    /**
     * Update the user session with the new password
     */
    req.session.user = updatePassword;

    return new HttpResponse(200, {
      message: 'Password updated successfully',
    });
  }
}
