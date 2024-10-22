import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()
      .then(() => {
        Logger.log(
          '🎉 --> Prisma connection success',
          '✔ - PrismaService - ✔',
        );
      })
      .catch(() => {
        console.log('DB connection failed');
      });
  }
}
