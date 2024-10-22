import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { bold } from 'cli-color';
import { EnvType } from '@Root/config/env.validation';
import { NotificationModuleApp } from './notification-app.module';
import handlebars from 'handlebars';
import * as fs from 'fs';

function registerPartials() {
  const partialsDir = 'apps/notification-service/src/core/views/partials/';
  const partialFiles = fs.readdirSync(partialsDir);

  partialFiles.forEach((file) => {
    const partialName = file.replace('.hbs', '');
    handlebars.registerPartial(
      partialName,
      fs.readFileSync(`${partialsDir}${file}`, 'utf8'),
    );
  });
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    NotificationModuleApp,
  );
  const configService = app.get(ConfigService<EnvType>);

  const PORT = configService.get<number>('NOTIFICATION_SERVICE_PORT');

  /**
Template engine configurations.
   */
  app.setViewEngine('hbs');
  app.useStaticAssets('apps/notification-service/src/core/public');
  app.setBaseViewsDir('apps/notification-service/src/core/views');

  /**
   * Register partials.
   */
  registerPartials();

  await app.listen(PORT).then(() => {
    Logger.log(bold.bgBlue(`Notification service is running on port ${PORT}`));
  });
}

bootstrap();
