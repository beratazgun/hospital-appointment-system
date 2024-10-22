const QUEUES = {
  NOTIFICATION_EMAIL: 'notification.email',
  NOTIFICATION_SMS: 'notification.sms',
} as const;

type QueueType = (typeof QUEUES)[keyof typeof QUEUES];

export { QUEUES, QueueType };
