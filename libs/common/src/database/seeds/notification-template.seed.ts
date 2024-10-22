import { prismaClient } from './prisma-client';

export async function notificationTemplateSeed() {
  await prismaClient.notificationTemplate.createMany({
    data: [
      {
        code: 'VERIFY_EMAIL_AFTER_SIGNUP',
        subject: 'Verify your email',
        emailTemplateFileName: 'verify-email-after-signup.hbs',
        description: 'Email template for verifying email after signup',
        params: ['FIRST_NAME', 'OTP_CODE'],
        type: 'EMAIL',
      },
      {
        code: 'VERIFIED_EMAIL',
        subject: 'Welcome 🎉🎉🎉',
        emailTemplateFileName: 'verified-email.hbs',
        description:
          'Email template for welcoming user after email verification',
        params: ['FIRST_NAME'],
        type: 'EMAIL',
      },
      {
        code: 'CREATED_APPOINTMENT',
        subject: 'Created Appointment',
        emailTemplateFileName: 'created-appointment.hbs',
        description:
          'Email template for notifying user after creating an appointment',
        params: [
          'FULL_NAME',
          'HOSPITAL_NAME',
          'POLYCLINIC_NAME',
          'DOCTOR_NAME',
          'APPOINTMENT_DATE',
          'HOSPITAL_ADDRESS',
        ],
        type: 'EMAIL',
      },
      {
        code: 'CANCELLED_APPOINTMENT',
        subject: 'Cancelled Appointment',
        emailTemplateFileName: 'cancelled-appointment.hbs',
        description:
          'Email template for notifying user after cancelling an appointment',
        params: [
          'FULL_NAME',
          'HOSPITAL_NAME',
          'POLYCLINIC_NAME',
          'DOCTOR_NAME',
          'APPOINTMENT_DATE',
          'HOSPITAL_ADDRESS',
        ],
        type: 'EMAIL',
      },
      {
        code: 'FORGOT_PASSWORD',
        subject: 'Forgot Password ',
        emailTemplateFileName: 'forgot-password.hbs',
        description:
          'Email template for notifying user after forgetting password',
        params: ['FULL_NAME', 'OTP_CODE'],
        type: 'EMAIL',
      },
      {
        code: 'UPDATED_PASSWORD',
        subject: 'Updated Password ',
        emailTemplateFileName: 'updated-password.hbs',
        description:
          'Email template for notifying user after updating password',
        params: ['FULL_NAME', 'UPDATED_AT'],
        type: 'EMAIL',
      },
      {
        code: 'UPCOMING_APPOINTMENT_REMINDER',
        subject: 'You have an upcoming appointment',
        emailTemplateFileName: 'upcoming-appointment.hbs',
        description:
          'Email template for notifying user about upcoming appointment',
        params: [
          'FULL_NAME',
          'HOSPITAL_NAME',
          'POLYCLINIC_NAME',
          'DOCTOR_NAME',
          'APPOINTMENT_DATE',
          'HOSPITAL_ADDRESS',
        ],
        type: 'EMAIL',
      },
      {
        code: 'APPROVED_APPOINTMENT',
        subject: 'Congratulations! Your appointment has been approved',
        emailTemplateFileName: 'approved-appointment.hbs',
        description:
          'Email template for notifying user after approving an appointment',
        params: ['FULL_NAME', 'APPOINTMENT_DATE'],
        type: 'EMAIL',
      },
      {
        code: 'CANCELLED_APPOINTMENT_BY_SYSTEM',
        subject: 'Cancelled Appointment by System',
        emailTemplateFileName: 'cancelled-appointment-by-system.hbs',
        description:
          'Email template for notifying user after cancelling an appointment by system',
        params: [
          'FULL_NAME',
          'HOSPITAL_NAME',
          'POLYCLINIC_NAME',
          'DOCTOR_NAME',
          'APPOINTMENT_DATE',
          'HOSPITAL_ADDRESS',
        ],
        type: 'EMAIL',
      },
    ],
    skipDuplicates: true,
  });
}
