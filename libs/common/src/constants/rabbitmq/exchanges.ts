const EXCHANGES = {
  NOTIFICATION: 'notification',
  RABBITMQ_TOPIC: 'rabbitmq-topic',
} as const;

const GOLEVELUP_EXCHANGES_DEFINITIONS = [
  {
    name: EXCHANGES.NOTIFICATION,
    type: 'direct',
  },
  {
    name: EXCHANGES.RABBITMQ_TOPIC,
    type: 'topic',
  },
] as const;

type ExchangeType = (typeof EXCHANGES)[keyof typeof EXCHANGES];

export { GOLEVELUP_EXCHANGES_DEFINITIONS, EXCHANGES, ExchangeType };
