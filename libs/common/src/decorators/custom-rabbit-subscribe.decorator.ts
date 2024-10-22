import { ExchangeType, QueueType, RoutingKeyType } from '@common/constants';
import {
  RabbitHandlerConfig,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { applyDecorators } from '@nestjs/common';

type CustomRabbitHandlerConfig = Pick<
  RabbitHandlerConfig,
  | 'queue'
  | 'name'
  | 'deserializer'
  | 'connection'
  | 'exchange'
  | 'routingKey'
  | 'createQueueIfNotExists'
  | 'assertQueueErrorHandler'
  | 'queueOptions'
  | 'errorBehavior'
  | 'errorHandler'
  | 'allowNonJsonMessages'
  | 'usePersistentReplyTo'
> & {
  exchange: ExchangeType;
  routingKey: RoutingKeyType;
  queue: QueueType;
};

export function CustomRabbitSubscribe(config: CustomRabbitHandlerConfig) {
  return applyDecorators(RabbitSubscribe(config));
}
