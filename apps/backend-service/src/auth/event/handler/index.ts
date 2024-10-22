import { UserForgotPasswordHandler } from './user-forgot-password.handler';
import { UserResetPasswordHandler } from './user-reset-password.handler';
import { UserSignedInHandler } from './user-signed-in.handler';
import { UserSignedUpHandler } from './user-signed-up.handler';
import { VerifiedEmailHandler } from './verified-email.handler';;

export const AuthEventHandlers = [UserForgotPasswordHandler,
UserResetPasswordHandler,
UserSignedInHandler,
UserSignedUpHandler,
VerifiedEmailHandler,];
