import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { cache } from 'react';

export const getSignedInTraineeId = cache(async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error('session is not found');
  }

  return session.user.traineeId;
});
