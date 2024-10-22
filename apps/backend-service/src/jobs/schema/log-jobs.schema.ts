import { CustomSchema } from '@common/decorators/custom-schema.decorator';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@CustomSchema({
  timestamps: false,
  collection: 'log_jobs',
  autoCreate: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  databaseName: 'logs',
})
class LogJobsSchema extends Document {
  @Prop({ required: true, type: Date })
  jobStartedAt: Date;

  @Prop({ required: true, type: Date })
  jobEndedAt: Date;

  @Prop({ required: true, type: String })
  jobName: string;

  @Prop({ required: true, type: String })
  jobStatus: string;

  @Prop({ required: true, type: Number })
  jobDuration: number;

  @Prop({ required: true, type: String })
  createdAt: Date;
}

const LogJobsSchemaFactory = SchemaFactory.createForClass(LogJobsSchema);

type LogJobsSchemaType = Omit<LogJobsSchema, keyof Document>;

export { LogJobsSchema, LogJobsSchemaFactory, LogJobsSchemaType };
