import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { GetAllDoctorsQuery } from './query/impl/get-all-doctors.impl';
import { DoctorsQueryDto, DoctorsSearchQueryDto } from './dtos';
import { DoctorsSearchQuery } from './query/impl/doctors-search.impl';

@ApiTags('doctors')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly queryBus: QueryBus) {}

  /**
   * Get all doctors
   */
  @Get('all')
  async getAllDoctors(@Query() query: DoctorsQueryDto) {
    return this.queryBus.execute(new GetAllDoctorsQuery(query));
  }

  /**
   * Search doctors by name or speciality
   */
  @Get('search')
  async searchDoctors(@Query() query: DoctorsSearchQueryDto) {
    return this.queryBus.execute(new DoctorsSearchQuery(query));
  }
}
