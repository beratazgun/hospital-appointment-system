import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { UserSignedInEvent } from '@backend/auth/event/impl/user-signed-in.impl';
import { AuthRepository } from '@backend/auth/repository/auth.repository';
import { omit } from 'lodash';

@EventsHandler(UserSignedInEvent)
export class UserSignedInHandler implements IEventHandler<UserSignedInEvent> {
  constructor(private readonly authRepoitory: AuthRepository) {}

  async handle(event: UserSignedInEvent) {
    const { userData, req } = event;

    req.session.user = omit(userData, ['OneTimePassword', 'BlockedUsers']);

    /**
     * If the user logs into the system with less than 5 attempts, we reset the number of incorrect attempts.
     */
    await this.authRepoitory.resetFailedLoginAttempts(userData.id);
  }
}
