import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { ExistRedisTypes } from './types';
import { REDIS_CONNECTION } from './redis.module';

type ExecuteOptions = {
  parseJson?: boolean;
};

type RedisKeyDefinition = {
  prefix: string;
  suffix: string;
  separator?: '#' | ':' | '$' | '@';
};

type ExecuteRedisCommand<TRedisKey> = (
  instance: Redis,
  redisKey: TRedisKey,
) => Promise<string | number>;

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CONNECTION) private readonly redisClient: Redis) {}

  /**
   * Execute a redis command
   * @example
   * ```ts
   *  redisService.execute<UserSessionType>((instance, redisKey) =>
   *   instance.set(
   *    redisKey({
   *      prefix: 'passwordResetToken',
   *      suffix: '123',
   *   }),
   *    JSON.stringify({
   *      id: 123,
   *      firstName: 'John',
   *      passwordResetToken: '412414124',
   *    }),
   *   'EX',
   *   10 * 60,
   *  ),
   * );
   * ```
   */
  async execute<TReturnType extends ExistRedisTypes>(
    redisCommand: ExecuteRedisCommand<typeof this.generateRedisKey>,
    options: ExecuteOptions = { parseJson: false },
  ) {
    const result = await redisCommand(this.redisClient, this.generateRedisKey);

    if (options.parseJson === true && typeof result === 'string') {
      return JSON.parse(result) satisfies TReturnType;
    }

    return result;
  }

  /**
   * Generate a redis key
   *
   * ```ts
   * const key = redisManager.generateRedisKey({
   *  prefix: 'user',
   *  suffix: '123456789',
   * });
   * ```
   */
  generateRedisKey({
    prefix,
    suffix,
    separator = '#',
  }: RedisKeyDefinition): string {
    return `${prefix}${separator}${suffix}`;
  }
}
