import { User } from '@prisma/client';

export type UserSessionType = User & {
  sessionToken: string;
  sessionExpiresAt: Date;
};
