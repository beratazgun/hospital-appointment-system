// @types/express/index.d.ts
import 'express';

import { AuthLogActionTypesType } from '@backend/auth/schema/log-auth-process.schema';

declare module 'express' {
  export interface Request {
    ctlAction?: AuthLogActionTypesType;
  }
}
