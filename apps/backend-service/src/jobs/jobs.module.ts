import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { JobsCommandHandlers } from './command/handler';
import { CqrsModule } from '@nestjs/cqrs';
import { JobsRepository } from './repository/jobs.repository';

@Module({
  imports: [CqrsModule, ScheduleModule.forRoot()],
  providers: [JobsRepository, ...JobsCommandHandlers],
  controllers: [JobsController],
})
export class JobsModule {}
