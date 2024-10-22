import Generator from '@common/helpers/generator';
import { prismaClient } from './prisma-client';
import { Doctor, Gender, Hospital, Polyclinic } from '@prisma/client';

const maleNames = [
  'alp',
  'doruk',
  'ege',
  'mert',
  'baran',
  'emir',
  'onur',
  'kaan',
  'tuna',
  'yiğit',
  'berat',
  'berk',
  'can',
  'deniz',
  'efe',
  'fırat',
  'görkem',
  'hakan',
  'ilker',
  'kerem',
  'levent',
  'celal',
  'kadir',
  'oğuz',
  'çağrı',
  'taner',
  'umut',
  'volkan',
  'tolga',
  'cenk',
];

const femaleNames = [
  'elif',
  'zeynep',
  'asya',
  'beren',
  'derya',
  'defne',
  'ışıl',
  'ece',
  'naz',
  'selin',
  'yasemin',
  'sude',
  'merve',
  'aylin',
  'buse',
  'ceren',
  'duygu',
  'ebru',
  'fulya',
  'gizem',
  'hilal',
  'irem',
  'kübra',
  'lale',
  'melis',
  'nisan',
  'özge',
  'pınar',
  'rabia',
  'gül',
  'şeyma',
  'simay',
  'tuğçe',
  'hazal',
  'nehir',
  'damla',
  'aslı',
  'dila',
];

const lastNames = [
  'karakaya',
  'öztürk',
  'akarsu',
  'çelik',
  'demir',
  'yılmaz',
  'şahin',
  'aydın',
  'kılıç',
  'koç',
  'polat',
  'aydın',
  'çelikten',
  'güneş',
  'tuncer',
  'özdemir',
  'sezer',
  'doğan',
  'arslan',
  'kurt',
];

const genders = ['MALE', 'FEMALE'];

function getRandomElement<T>(array: T[]) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateDoctors(
  polyclinics: Polyclinic[],
  hospitals: Hospital[],
): Doctor[] {
  const doctors: any[] = [];

  for (let i = 0; i < 50; i++) {
    const gender = getRandomElement(genders);
    const firstName =
      gender === 'Male'
        ? getRandomElement(maleNames)
        : getRandomElement(femaleNames);
    const lastName = getRandomElement(lastNames);

    const doctor = {
      doctorCode: Generator.random(8, 'numeric'),
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      gender,
      dateOfBirth: randomDate(new Date(1960, 0, 1), new Date(2000, 11, 31)),
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: `0555${Generator.random(7, 'numeric')}`,
      polyclinicID: getRandomElement<Polyclinic>(polyclinics).id,
      hospitalID: getRandomElement<Hospital>(hospitals).id,
      yearsOfExperience: Math.floor(Math.random() * 40) + 1,
    };

    doctors.push(doctor);
  }

  return doctors;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

export async function doctorsSeed() {
  const hospitals = await prismaClient.hospital.findMany();
  const polyclinics = await prismaClient.polyclinic.findMany();

  const doctors = generateDoctors(polyclinics, hospitals);

  await prismaClient.doctor.createMany({
    data: doctors,
    skipDuplicates: true,
  });
}
