import { GlobalRepository } from '@backend/global/repository/global.repository';
import { MongodbModule } from '@common/modules/mongodb/mongodb.module';
import { PrismaModule } from '@common/modules/prisma/prisma.module';
import { RabbitmqModule } from '@common/modules/rabbitmq/rabbitmq.module';
import { RedisModule } from '@common/modules/redis/redis.module';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [
    RedisModule.forRootAsync(),
    PrismaModule,
    MongodbModule,
    RabbitmqModule,
  ],
  providers: [GlobalRepository],
  exports: [GlobalRepository],
})
export class SharedModule {}
