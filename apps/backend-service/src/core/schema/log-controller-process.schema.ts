import { LOG_LEVELS_ENUM } from '@common/constants/log-levels';
import { CustomSchema } from '@common/decorators/custom-schema.decorator';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

type processType = `${string}->${string}`;

class ResponseSchema extends Document {
  @Prop({ required: true, type: Number })
  statusCode: number;

  @Prop({ required: true, type: Object })
  payload: object;
}

class RequestSchema extends Document {
  @Prop({ required: true, type: String })
  url: string;

  @Prop({ required: true, type: String })
  method: string;

  @Prop({ required: true, type: Object })
  headers: object;

  @Prop({ required: true, type: Object })
  body: object;

  @Prop({ required: true, type: Object })
  query: object;
}

@CustomSchema({
  timestamps: false,
  collection: 'log_controller_process',
  autoCreate: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  databaseName: 'logs',
})
class LogControllerProcessSchema extends Document {
  @Prop({ required: true, type: String })
  controllerName: string;

  @Prop({ required: true, index: true, type: String })
  actionType: processType;

  @Prop({
    required: true,
    index: true,
    alias: 'log_level',
    enum: LOG_LEVELS_ENUM,
    type: Object,
  })
  logLevel: LOG_LEVELS_ENUM;

  @Prop({ required: true, type: String })
  userAgent: string;

  @Prop({ required: true, type: ResponseSchema })
  response: ResponseSchema;

  @Prop({ required: true, type: RequestSchema })
  request: RequestSchema;

  @Prop({ required: false, type: String })
  userID: string;

  @Prop({ required: true, index: true, alias: 'created_at', type: Date })
  createdAt: Date;
}

const LogControllerProcessSchemaFactory = SchemaFactory.createForClass(
  LogControllerProcessSchema,
);

type ControllerLogProcessSchemaType = Omit<
  LogControllerProcessSchema,
  keyof Document
>;

export {
  processType,
  LogControllerProcessSchema,
  LogControllerProcessSchemaFactory,
  ControllerLogProcessSchemaType,
};
