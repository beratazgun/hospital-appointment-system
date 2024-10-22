import {
  LogNotificationSchema,
  LogNotificationSchemaFactory,
} from 'apps/notification-service/src/consumer/schemas/log-notification.schema';
import {
  LogJobsSchema,
  LogJobsSchemaFactory,
} from 'apps/backend-service/src/jobs/schema/log-jobs.schema';
import {
  LogControllerProcessSchema,
  LogControllerProcessSchemaFactory,
} from '@backend/core/schema/log-controller-process.schema';
import { Schema } from 'mongoose';

export type MongodbSchemasNameType =
  | 'LogNotificationSchema'
  | 'LogJobsSchema'
  | 'LogControllerProcessSchema';

export const MONGODB_SCHEMAS_MAP = new Map<
  MongodbSchemasNameType,
  { name: string; schema: Schema }
>([
  [
    'LogNotificationSchema',
    {
      name: LogNotificationSchema.name,
      schema: LogNotificationSchemaFactory,
    },
  ],
  [
    'LogJobsSchema',
    {
      name: LogJobsSchema.name,
      schema: LogJobsSchemaFactory,
    },
  ],
  [
    'LogControllerProcessSchema',
    {
      name: LogControllerProcessSchema.name,
      schema: LogControllerProcessSchemaFactory,
    },
  ],
]);
