import { User, OneTimePassword } from '@prisma/client';

export class UserSignedUpEvent {
  constructor(
    public userData: User & {
      oneTimePasswords: OneTimePassword;
    },
  ) {}
}
