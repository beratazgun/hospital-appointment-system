import { UserResetPasswordBodyDto } from '@backend/auth/dtos';

export class UserResetPasswordCommand {
  constructor(public body: UserResetPasswordBodyDto) {}
}
