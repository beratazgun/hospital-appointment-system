import { UserSignupBodyDto } from '@backend/auth/dtos';

export class UserSignUpCommand {
  constructor(public readonly body: UserSignupBodyDto) {}
}
