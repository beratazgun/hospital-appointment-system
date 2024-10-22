import { UserForgetPasswordQueryDto } from '@backend/auth/dtos';

export class UserForgetPasswordCommand {
  constructor(public query: UserForgetPasswordQueryDto) {}
}
