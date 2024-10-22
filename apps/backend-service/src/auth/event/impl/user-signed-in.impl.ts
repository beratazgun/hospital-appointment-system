import { User } from '@prisma/client';
import { Request } from 'express';

export class UserSignedInEvent {
  constructor(
    public readonly userData: User,
    public readonly req: Request,
  ) {}
}
