import { DoctorsQueryDto } from '@backend/doctors/dtos';

export class GetAllDoctorsQuery {
  constructor(public query: DoctorsQueryDto) {}
}
