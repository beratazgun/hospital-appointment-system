import { UserSigninBodyDto } from '@backend/auth/dtos';
import { Request } from 'express';

export class UserSignInCommand {
  constructor(
    public readonly body: UserSigninBodyDto,
    public readonly req: Request,
  ) {}
}
