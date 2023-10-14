import { PrismaClient } from '@prisma/client';
import { auth } from '../src/lib/firebase/admin';
import { firebaseUsers } from './fixtures/firebase-user';

const prisma = new PrismaClient();

async function main() {}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
