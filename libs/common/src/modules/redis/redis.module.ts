import { DynamicModule, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import fs from 'fs';
import { RedisService } from './redis.service';
import { EnvType } from '@Root/config/env.validation';

export const REDIS_CONNECTION = 'REDIS_CONNECTION';

@Module({})
export class RedisModule {
  static forRootAsync(): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        {
          provide: REDIS_CONNECTION,
          useFactory: (configService: ConfigService<EnvType>) =>
            this.connectRedis(configService),
          inject: [ConfigService<EnvType>],
        },
        {
          provide: RedisService,
          useFactory: (redisConnection: Redis) =>
            new RedisService(redisConnection),
          inject: [REDIS_CONNECTION],
        },
      ],
      exports: [REDIS_CONNECTION, RedisService],
    };
  }

  private static connectRedis(configService: ConfigService<EnvType>): Redis {
    const port = configService.get<number>('REDIS_PORT');
    const host = configService.get<string>('REDIS_HOST');
    const password = configService.get<string>('REDIS_PASSWORD');
    const nodeENV = configService.get<string>('NODE_ENV');

    if (nodeENV === 'development') {
      Logger.log('🎉 --> Redis connection success', '✔ - Redis - ✔');
    }

    return new Redis({
      port: Number(port),
      host: host as string,
      [password ? 'password' : null]: password ? password : undefined,
    });
  }

  async onModuleInit() {
    const redisTypeList: string[] = [];
    const exportedRedisTypesList: string[] = [];

    fs.readdir('./libs/common/src/modules/redis/types', (err, files) => {
      files
        .filter((el) => el !== 'index.ts')
        .forEach((file) => {
          if (err) {
            console.log('err -->', err);
          }

          const readFile = fs.readFileSync(
            `./libs/common/src/modules/redis/types/${file}`,
            'utf8',
          );

          const getTypeNameFromFile = readFile
            .match(/export type (\w+)/g)
            .map((el) => el.split(' ')[2]);

          redisTypeList.push(getTypeNameFromFile.join('\n'));

          exportedRedisTypesList.push(
            `import { ${getTypeNameFromFile} } from './${file.slice(0, file.length - 3)}';`,
          );
        });

      fs.writeFileSync(
        'libs/common/src/modules/redis/types/index.ts',
        `${exportedRedisTypesList.join('\n')}\n\nexport type ExistRedisTypes =  ${redisTypeList.join(' | ')};`,
      );
    });
  }
}
