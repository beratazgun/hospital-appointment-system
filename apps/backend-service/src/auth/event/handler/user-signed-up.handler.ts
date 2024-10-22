import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { EmailTemplateType } from '@common/modules/rabbitmq/types';
import { RabbitmqService } from '@common/modules/rabbitmq/rabbitmq.service';
import { UserSignedUpEvent } from '../impl/user-signed-up.impl';
import { GlobalRepository } from '@backend/global/repository/global.repository';

@EventsHandler(UserSignedUpEvent)
export class UserSignedUpHandler implements IEventHandler<UserSignedUpEvent> {
  constructor(
    private readonly rabbitmq: RabbitmqService,
    private readonly globalRepository: GlobalRepository,
  ) {}

  async handle(event: UserSignedUpEvent) {
    const { userData } = event;

    const emailTemplate =
      await this.globalRepository.getNotificationTemplateByCodeAndType(
        'VERIFY_EMAIL_AFTER_SIGNUP',
        'EMAIL',
      );

    await this.rabbitmq.publish<EmailTemplateType>(
      'notification',
      'notification.email',
      {
        to: [userData.email],
        templateParams: {
          FIRST_NAME: userData.firstName,
          OTP_CODE: userData.oneTimePasswords.code,
        },
        template: emailTemplate,
      },
    );
  }
}
