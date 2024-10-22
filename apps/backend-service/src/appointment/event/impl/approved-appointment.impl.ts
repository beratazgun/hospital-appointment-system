export class ApprovedAppointmentEvent {
  constructor(
    public fullName: string,
    public patientEmail: string,
    public appointmentDate: Date,
  ) {}
}
