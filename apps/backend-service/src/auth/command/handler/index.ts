import { UserUpdatePasswordHandler } from './user-update-password.handler';
import { UserForgetPasswordHandler } from './user-forget-password.handler';
import { UserResetPasswordHandler } from './user-reset-password.handler';
import { UserSignInHandler } from './user-sign-in.handler';
import { UserSignUpHandler } from './user-sign-up.handler';
import { VerifyEmailHandler } from './verify-email.handler';

export const AuthCommandHandlers = [
  UserUpdatePasswordHandler,
  UserForgetPasswordHandler,
  UserResetPasswordHandler,
  UserSignInHandler,
  UserSignUpHandler,
  VerifyEmailHandler,
];
