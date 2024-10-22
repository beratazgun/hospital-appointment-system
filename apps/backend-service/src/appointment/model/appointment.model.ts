import { AggregateRoot } from '@nestjs/cqrs';
import { CreatedAppointmentEvent } from '../event/impl/created-appointment.impl';
import { CancelledAppointmentEvent } from '../event/impl/cancelled-appointment.impl';
import { ApprovedAppointmentEvent } from '../event/impl/approved-appointment.impl';

type AppointmentDetails = {
  patientEmail: string;
  fullName: string;
  hospitalName: string;
  polyclinicName: string;
  appointmentDate: string;
  hospitalAddress: string;
  doctorName: string;
};

export class AppointmentModel extends AggregateRoot {
  constructor() {
    super();
  }

  /**
   * Send Email after created appointment
   */
  public sendEmailAfterCreatedAppointment({
    patientEmail,
    fullName,
    hospitalName,
    polyclinicName,
    appointmentDate,
    hospitalAddress,
    doctorName,
  }: AppointmentDetails) {
    this.apply(
      new CreatedAppointmentEvent(
        patientEmail,
        fullName,
        hospitalName,
        polyclinicName,
        appointmentDate,
        hospitalAddress,
        doctorName,
      ),
    );
  }

  /**
   * Send Email after cancelled appointment
   */
  public sendEmailAfterCancelledAppointment({
    patientEmail,
    fullName,
    hospitalName,
    polyclinicName,
    appointmentDate,
    hospitalAddress,
    doctorName,
  }: AppointmentDetails) {
    this.apply(
      new CancelledAppointmentEvent(
        patientEmail,
        fullName,
        hospitalName,
        polyclinicName,
        appointmentDate,
        hospitalAddress,
        doctorName,
      ),
    );
  }

  /**
   * Send Email after approved appointment
   */
  public sendEmailAfterApprovedAppointment(
    fullname: string,
    patientEmail: string,
    appointmentDate: Date,
  ) {
    this.apply(
      new ApprovedAppointmentEvent(fullname, patientEmail, appointmentDate),
    );
  }
}

export const appointmentModelInstance = new AppointmentModel();
