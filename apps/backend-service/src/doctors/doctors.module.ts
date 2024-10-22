import { Module } from '@nestjs/common';
import { DoctorsController } from './doctors.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { DoctorsQueryHandlers } from './query/handler';
import { DoctorsRepository } from './repository/doctors.repository';
import { Paginator } from '@backend/core/helpers/paginator';

@Module({
  imports: [CqrsModule],
  providers: [DoctorsRepository, Paginator, ...DoctorsQueryHandlers],
  controllers: [DoctorsController],
})
export class DoctorsModule {}
