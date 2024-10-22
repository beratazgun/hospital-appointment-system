import { RabbitmqModule } from '@common/modules/rabbitmq/rabbitmq.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConsumerModule } from './consumer/consumer.module';
import { NotificationAppController } from './notification-app.controller';
import { MongodbModule } from '@common';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `
        ${
          process.env.NODE_ENV === 'development'
            ? './config/.env.development'
            : './config/.env.production'
        }`,
      isGlobal: true,
    }),
    RabbitmqModule,
    ConsumerModule,
    MongodbModule,
  ],
  controllers: [NotificationAppController],
})
export class NotificationModuleApp {}
