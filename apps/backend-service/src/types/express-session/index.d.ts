import { User } from '@prisma/client';
import type { Session, SessionData } from 'express-session';

declare module 'express-session' {
  interface SessionData {
    user: Partial<User>;
  }

  interface Session {
    user: Partial<User>;
  }
}
