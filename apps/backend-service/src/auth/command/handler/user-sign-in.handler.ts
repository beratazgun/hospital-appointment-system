import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UserSignInCommand } from '@backend/auth/command/impl/user-sign-in.impl';
import { authModelInstance } from '@backend/auth/model/auth.model';
import { AuthRepository } from '@backend/auth/repository/auth.repository';
import HashManager from '@common/helpers/hash-manager';
import { omit } from 'lodash';
import { HttpResponse } from '@common/helpers/http-response';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { format, isBefore } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
@CommandHandler(UserSignInCommand)
export class UserSignInHandler implements ICommandHandler<UserSignInCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly authRepository: AuthRepository,
  ) {}
  async execute(command: UserSignInCommand) {
    const { body, req } = command;

    const authModelContext =
      this.publisher.mergeObjectContext(authModelInstance);

    const user = await this.authRepository.signinUser(body);

    if (!user) {
      return new BadRequestException('Please check your email or password');
    }

    const { isEmailVerified, status, BlockedUser } = user;

    const exceptions = [
      {
        condition: isEmailVerified === false,
        message: 'Email not verified. Please verify your email.',
      },
      {
        condition: status !== 'ACTIVE',
        message:
          status === 'BLOCKED'
            ? 'Your account has been blocked. Please contact support.'
            : 'Your account has been deleted. Please contact support.',
      },
      {
        condition:
          BlockedUser !== null &&
          isBefore(
            toZonedTime(new Date(), 'Europe/Istanbul'),
            BlockedUser.blockedUntil,
          ),
        message: `Your account has been temprorary blocked until ${
          BlockedUser && format(BlockedUser.blockedUntil, 'yyyy-MM-dd HH:mm')
        }`,
      },
    ];

    const exception = exceptions.find(
      (exception) => exception.condition === true,
    );

    if (exception) {
      return new BadRequestException(exception.message);
    }

    if (user.failedLoginAttempts >= 5) {
      /**
       * Block user for 1 hour
       */
      !BlockedUser &&
        (await this.authRepository.blockUserAsTemprorary(user.id));

      return new BadRequestException(
        'You have tried too many incorrect passwords. Your account has been blocked for 1 hour. Please try again in 1 hour',
      );
    }

    if (
      !user ||
      !(await HashManager.comparePassword(body.password, user.password))
    ) {
      /**
       * Increment failed login attempts
       */
      await this.authRepository.incrementFailedLoginAttempts(user.id);
      return new BadRequestException('Please check your email or password');
    }

    authModelContext.saveUserSession(user, req);
    authModelContext.commit();

    /**
     * This is for logging purpose. This will use AuthLoggerInterceptor
     */
    return new HttpResponse(200, {
      message: 'Signin successful',
      payload: {
        user: omit(user, ['password', 'id']),
      },
    });
  }
}
