const CHANNELS = {
  SMS_CHANNEL: 'smsChannel',
  EMAIL_CHANNEL: 'emailChannel',
} as const;

const GOLEVELUP_CHANNELS_DEFINITIONS = {
  [CHANNELS.SMS_CHANNEL]: {
    prefetchCount: 50,
  },
  [CHANNELS.EMAIL_CHANNEL]: {
    prefetchCount: 50,
  },
} as const;

type ChannelType = keyof typeof GOLEVELUP_CHANNELS_DEFINITIONS;

export { GOLEVELUP_CHANNELS_DEFINITIONS, CHANNELS, ChannelType };
