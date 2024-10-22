import { GetAppointmentsQueryDto } from '@backend/appointment/dtos/get-appointments-query.dto';

export class GetAppointmentsQuery {
  constructor(public readonly query: GetAppointmentsQueryDto) {}
}
