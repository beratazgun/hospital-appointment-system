import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { ResendEmailProvider } from '@notification/core/providers/ResendEmailProvider';

@Module({
  providers: [ConsumerService, ResendEmailProvider],
})
export class ConsumerModule {}
