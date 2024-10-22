import { IEventHandler } from '@nestjs/cqrs';
import { EventsHandler } from '@nestjs/cqrs/dist/decorators/events-handler.decorator';
import { VerifiedEmailEvent } from '@backend/auth/event/impl/verified-email.impl';
import { RabbitmqService } from '@common/modules/rabbitmq/rabbitmq.service';
import { EmailTemplateType } from '@common/modules/rabbitmq/types';
import { PrismaService } from '@common';
import { ConfigService } from '@nestjs/config';
import { EnvType } from '@Root/config/env.validation';
import { GlobalRepository } from '@backend/global/repository/global.repository';

@EventsHandler(VerifiedEmailEvent)
export class VerifiedEmailHandler implements IEventHandler<VerifiedEmailEvent> {
  constructor(
    private readonly rabbitmq: RabbitmqService,
    private readonly globalRepository: GlobalRepository,
    private readonly prismaService: PrismaService,
  ) {}

  async handle(event: VerifiedEmailEvent) {
    const { userID } = event;

    const userData = await this.prismaService.user.findFirst({
      where: {
        id: userID,
      },
    });

    const emailTemplate =
      await this.globalRepository.getNotificationTemplateByCodeAndType(
        'VERIFIED_EMAIL',
        'EMAIL',
      );

    await this.rabbitmq.publish<EmailTemplateType>(
      'notification',
      'notification.email',
      {
        to: [userData.email],
        templateParams: {
          FIRST_NAME: userData.firstName,
        },
        template: emailTemplate,
      },
    );
  }
}
