export class CreatedAppointmentEvent {
  constructor(
    public readonly patientEmail: string,
    public readonly fullName: string,
    public readonly hospitalName: string,
    public readonly polyclinicName: string,
    public readonly appointmentDate: string,
    public readonly hospitalAddress: string,
    public readonly doctorName: string,
  ) {}
}
