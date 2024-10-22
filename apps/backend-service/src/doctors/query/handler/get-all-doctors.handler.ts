import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetAllDoctorsQuery } from '@backend/doctors/query/impl/get-all-doctors.impl';
import { HttpResponse } from '@common/helpers/http-response';
import { DoctorsRepository } from '@backend/doctors/repository/doctors.repository';
import { omit } from 'lodash';

@QueryHandler(GetAllDoctorsQuery)
export class GetAllDoctorsHandler implements IQueryHandler<GetAllDoctorsQuery> {
  constructor(private readonly doctorsRepository: DoctorsRepository) {}

  async execute(event: GetAllDoctorsQuery) {
    const getAllDoctorsAsPaginated = await this.doctorsRepository.getAllDoctors(
      event.query,
    );

    const modifiedAllDoctors = getAllDoctorsAsPaginated.docs.map((doctor) => {
      return {
        fullName: doctor.fullName,
        doctorCode: doctor.doctorCode,
        polyclinic: {
          name: doctor.Polyclinic.name,
          code: doctor.Polyclinic.code,
        },
        hospital: omit(doctor.Hospital, ['id']),
      };
    });

    return new HttpResponse(200, {
      ...omit(getAllDoctorsAsPaginated, ['docs']),
      docs: modifiedAllDoctors,
    });
  }
}
