import { doctorsSeed } from './doctors.seed';
import { hospitalsSeed } from './hospitals.seed';
import { notificationTemplateSeed } from './notification-template.seed';
import { polyclinicsSeed } from './polyclinics.seed';
import { usersSeed } from './users.seed';

async function runSeed() {
  await usersSeed();
  await notificationTemplateSeed();
  await hospitalsSeed();
  await polyclinicsSeed();
  await doctorsSeed();
}

runSeed().then(() => {
  console.log('Seeding complete');

  process.exit(0);
});
