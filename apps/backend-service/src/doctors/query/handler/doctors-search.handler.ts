import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { DoctorsSearchQuery } from '@backend/doctors/query/impl/doctors-search.impl';
import { DoctorsRepository } from '@backend/doctors/repository/doctors.repository';
import { HttpResponse } from '@common/helpers/http-response';

@QueryHandler(DoctorsSearchQuery)
export class DoctorsSearchHandler implements IQueryHandler<DoctorsSearchQuery> {
  constructor(private readonly doctorRepository: DoctorsRepository) {}

  async execute(event: DoctorsSearchQuery) {
    const {
      query: { search },
    } = event;

    const searchResult = await this.doctorRepository.searchDoctor(search);

    return new HttpResponse(200, {
      result: searchResult,
    });
  }
}
