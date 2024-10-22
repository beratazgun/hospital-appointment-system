import { Global, Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';
import { EnvType } from '@Root/config/env.validation';
import { MONGODB_SCHEMAS_MAP } from '.';

/**
 * Mongoose connection factory
 */
function mongooseConnectionFactory(
  configService: ConfigService<EnvType>,
  dbName: string,
) {
  return {
    uri: configService.get('MONGO_URI'),
    dbName,
    onConnectionCreate(connection: Connection) {
      if (configService.get('NODE_ENV') === 'development') {
        connection.on('connected', () =>
          Logger.log(
            `🎉 --> MongoDB connection success `,
            `✔ - Mongodb | ${dbName} - ✔`,
          ),
        );
      }
    },
  };
}

@Global()
@Module({
  imports: [
    // Logs database connection
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        mongooseConnectionFactory(configService, 'logs'),
      connectionName: 'logs',
      inject: [ConfigService],
    }),
    // Admin database connection
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        mongooseConnectionFactory(configService, 'admin'),
      connectionName: 'admin',
      inject: [ConfigService],
    }),
    MongooseModule.forFeature(
      [
        MONGODB_SCHEMAS_MAP.get('LogControllerProcessSchema'),
        MONGODB_SCHEMAS_MAP.get('LogNotificationSchema'),
        MONGODB_SCHEMAS_MAP.get('LogJobsSchema'),
      ],
      'logs',
    ),
  ],

  exports: [MongooseModule],
})
export class MongodbModule {}
