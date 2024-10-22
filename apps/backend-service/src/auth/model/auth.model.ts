import { AggregateRoot } from '@nestjs/cqrs';
import { UserSignedUpEvent } from '@backend/auth/event/impl/user-signed-up.impl';
import { VerifiedEmailEvent } from '@backend/auth/event/impl/verified-email.impl';
import { User, OneTimePassword } from '@prisma/client';
import { UserSignedInEvent } from '@backend/auth/event/impl/user-signed-in.impl';
import { Request } from 'express';
import { UserForgotPasswordEvent } from '../event/impl/user-forgot-password.impl';
import { UserResetPasswordEvent } from '../event/impl/user-reset-password.impl';

export class AuthModel extends AggregateRoot {
  constructor() {
    super();
  }

  /**
   * This method is called when the user has signed up. It should trigger the UserSignedUpEvent
   */
  public signedUpUser(
    userData: User & {
      oneTimePasswords: OneTimePassword;
    },
  ) {
    this.apply(new UserSignedUpEvent(userData));
  }

  /**
   * This method is called when the user has verified their email
   */
  public verifiedEmail(userID: number) {
    this.apply(new VerifiedEmailEvent(userID));
  }

  /**
   * This method is called when the user has signed in. It will save the user session on the redis.
   */
  public saveUserSession(userData: User, req: Request) {
    this.apply(new UserSignedInEvent(userData, req));
  }

  /**
   * Forgot password. This method is called when the user has forgotten their password.
   */
  public userForgotPassword(email: string, fullName: string, otpCode: number) {
    this.apply(new UserForgotPasswordEvent(email, fullName, otpCode));
  }

  /**
   * This method is called when the user has reset their password
   */
  public userPasswordResetCompleted(
    email: string,
    fullName: string,
    updatedAt: Date,
  ) {
    this.apply(new UserResetPasswordEvent(email, fullName, updatedAt));
  }
}

export const authModelInstance = new AuthModel();
