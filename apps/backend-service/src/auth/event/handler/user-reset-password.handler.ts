import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { UserResetPasswordEvent } from '@backend/auth/event/impl/user-reset-password.impl';
import { RabbitmqService } from '@common/modules/rabbitmq/rabbitmq.service';
import { PrismaService } from '@common';
import { EmailTemplateType } from '@common/modules/rabbitmq/types';
import { intlFormat } from 'date-fns';
import { GlobalRepository } from '@backend/global/repository/global.repository';

@EventsHandler(UserResetPasswordEvent)
export class UserResetPasswordHandler
  implements IEventHandler<UserResetPasswordEvent>
{
  constructor(
    private readonly rabbitmq: RabbitmqService,
    private readonly globalRepository: GlobalRepository,
  ) {}

  async handle(event: UserResetPasswordEvent) {
    const { fullName, updatedAt, email } = event;

    const emailTemplate =
      await this.globalRepository.getNotificationTemplateByCodeAndType(
        'UPDATED_PASSWORD',
        'EMAIL',
      );

    await this.rabbitmq.publish<EmailTemplateType>(
      'notification',
      'notification.email',
      {
        to: [email],
        templateParams: {
          FULL_NAME: fullName,
          PASSWORD_UPDATED_AT: intlFormat(updatedAt, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          }),
        },
        template: emailTemplate,
      },
    );
  }
}
