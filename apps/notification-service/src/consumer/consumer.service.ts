import { CustomRabbitSubscribe } from '@common/decorators/custom-rabbit-subscribe.decorator';
import { EmailTemplateType } from '@common/modules/rabbitmq/types';
import { Injectable } from '@nestjs/common';
import { ResendEmailProvider } from '@notification/core/providers/ResendEmailProvider';
import { Message } from 'amqplib';

@Injectable()
export class ConsumerService {
  constructor(private resendEmailProvider: ResendEmailProvider) {}

  @CustomRabbitSubscribe({
    exchange: 'notification',
    queue: 'notification.email',
    routingKey: 'notification.email',
    errorHandler: async (channel, msg, error) => {
      channel.ack(msg);
    },
  })
  public async HandlerEmail(queueData: EmailTemplateType, amqpMsg: Message) {
    return this.resendEmailProvider.send(queueData);
  }
}
