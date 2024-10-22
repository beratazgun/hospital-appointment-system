import { Global, Module } from '@nestjs/common';
import { RabbitMQModule as GoLevelupRabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';
import {
  GOLEVELUP_CHANNELS_DEFINITIONS,
  GOLEVELUP_EXCHANGES_DEFINITIONS,
} from '@common/constants';
import fs from 'fs';
import { RabbitmqService } from './rabbitmq.service';
import { EnvType } from '@Root/config/env.validation';

@Global()
@Module({
  imports: [
    GoLevelupRabbitMQModule.forRootAsync(GoLevelupRabbitMQModule, {
      useFactory: (configService: ConfigService<EnvType>) => ({
        exchanges: [...GOLEVELUP_EXCHANGES_DEFINITIONS],
        uri: configService.get('RABBITMQ_URI'),
        channels: GOLEVELUP_CHANNELS_DEFINITIONS,
        connectionInitOptions: { wait: true, timeout: 30000 },
      }),
      inject: [ConfigService<EnvType>],
    }),
  ],
  providers: [RabbitmqService],
  exports: [GoLevelupRabbitMQModule, RabbitmqService],
})
export class RabbitmqModule {
  async onModuleInit() {
    const rabbitmqTypeList: string[] = [];
    const exportedRabbitmqTypesList: string[] = [];

    fs.readdir('./libs/common/src/modules/rabbitmq/types', (err, files) => {
      files
        .filter((el) => el !== 'index.ts')
        .forEach((file) => {
          if (err) {
            console.log('err -->', err);
          }

          const readFile = fs.readFileSync(
            `./libs/common/src/modules/rabbitmq/types/${file}`,
            'utf8',
          );

          const getTypeNameFromFile = readFile
            .match(/export type (\w+)/g)
            .map((el) => el.split(' ')[2]);

          rabbitmqTypeList.push(getTypeNameFromFile.join('\n'));

          exportedRabbitmqTypesList.push(
            `export { ${getTypeNameFromFile} } from './${file.slice(0, file.length - 3)}';`,
          );
        });

      fs.writeFileSync(
        'libs/common/src/modules/rabbitmq/types/index.ts',
        `${exportedRabbitmqTypesList.join('\n')}`,
      );
    });
  }
}
