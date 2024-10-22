import { CustomSchema } from '@common/decorators/custom-schema.decorator';
import { Attachments } from '@common/modules/rabbitmq/types/email-template.type';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { NotificationTemplate, NotificationType } from '@prisma/client';
import { Document } from 'mongoose';
import { CreateEmailResponseSuccess, ErrorResponse } from 'resend';

export enum LogNotificationNetworkStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
}

class SdkPayloadSchema {
  @Prop({
    type: String,
    required: true,
  })
  from: string;

  @Prop({
    type: Array<String>,
    required: true,
  })
  to: string[];

  @Prop({
    type: String,
    required: true,
  })
  subject: string;

  @Prop({
    type: String,
    required: true,
  })
  html: string;

  @Prop({
    type: Array<Attachments>,
    required: true,
  })
  attachments: Attachments[];
}

@CustomSchema({
  timestamps: false,
  collection: 'log_notification',
  autoCreate: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  databaseName: 'logs',
})
class LogNotificationSchema extends Document {
  @Prop({
    type: String,
    required: true,
    enum: NotificationType,
  })
  type: NotificationType;

  @Prop({
    type: Object,
    required: true,
  })
  template: Omit<NotificationTemplate, 'id'>;

  @Prop({
    type: Date,
    required: true,
    alias: 'created_at',
  })
  createdAt: Date;

  @Prop({
    type: SdkPayloadSchema,
    required: true,
    alias: 'sdk_payload',
  })
  sdkPayload: SdkPayloadSchema;

  @Prop({
    type: Object,
    required: true,
    alias: 'skd_response',
  })
  sdkResponse: CreateEmailResponseSuccess | ErrorResponse;
}

const LogNotificationSchemaFactory = SchemaFactory.createForClass(
  LogNotificationSchema,
);

type LogNotificationSchemaType = Omit<LogNotificationSchema, keyof Document>;

export {
  LogNotificationSchemaFactory,
  LogNotificationSchemaType,
  LogNotificationSchema,
};
