import { prismaClient } from './prisma-client';

export async function polyclinicsSeed() {
  await prismaClient.polyclinic.createMany({
    data: [
      {
        name: 'Cardiology Clinic',
        code: 'CARDIOLOGY_CLINIC',
      },
      {
        name: 'Orthopedics Clinic',
        code: 'ORTHOPEDICS_CLINIC',
      },
      {
        name: 'Dermatology Clinic',
        code: 'DERMATOLOGY_CLINIC',
      },
      {
        name: 'Neurology Clinic',
        code: 'NEUROLOGY_CLINIC',
      },
      {
        name: 'Ophthalmology Clinic',
        code: 'OPHTHALMOLOGY_CLINIC',
      },
      {
        name: 'Urology Clinic',
        code: 'UROLOGY_CLINIC',
      },
      {
        name: 'General Surgery Clinic',
        code: 'GENERAL_SURGERY_CLINIC',
      },
      {
        name: 'Ear, Nose and Throat (ENT) Clinic',
        code: 'ENT_CLINIC',
      },
      {
        name: 'Psychiatry Clinic',
        code: 'PSYCHIATRY_CLINIC',
      },
      {
        name: 'Physical Therapy and Rehabilitation Clinic',
        code: 'PHYSICAL_THERAPY_AND_REHABILITATION_CLINIC',
      },
    ],
    skipDuplicates: true,
  });
}
