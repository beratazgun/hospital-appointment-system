import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { UserForgotPasswordEvent } from '@backend/auth/event/impl/user-forgot-password.impl';
import { RabbitmqService } from '@common/modules/rabbitmq/rabbitmq.service';
import { PrismaService } from '@common';
import { EmailTemplateType } from '@common/modules/rabbitmq/types';
import { GlobalRepository } from '@backend/global/repository/global.repository';

@EventsHandler(UserForgotPasswordEvent)
export class UserForgotPasswordHandler
  implements IEventHandler<UserForgotPasswordEvent>
{
  constructor(
    private readonly rabbitmq: RabbitmqService,
    private readonly globalRepository: GlobalRepository,
  ) {}

  async handle(event: UserForgotPasswordEvent) {
    const { fullName, otpCode, email } = event;

    const emailTemplate =
      await this.globalRepository.getNotificationTemplateByCodeAndType(
        'FORGOT_PASSWORD',
        'EMAIL',
      );

    await this.rabbitmq.publish<EmailTemplateType>(
      'notification',
      'notification.email',
      {
        to: [email],
        templateParams: {
          FULL_NAME: fullName,
          OTP_CODE: otpCode,
        },
        template: emailTemplate,
      },
    );
  }
}
