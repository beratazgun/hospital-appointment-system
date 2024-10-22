import { ExchangeType, RoutingKeyType } from '@common/constants';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RabbitmqService {
  constructor(private readonly rabbitmq: AmqpConnection) {}

  async publish<T>(
    exchange: ExchangeType,
    routingKey: RoutingKeyType,
    message: T,
  ) {
    await this.rabbitmq.publish(exchange, routingKey, message);
  }
}
