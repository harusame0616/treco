import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

export const SIGNED_IN_TRAINEE_ID_COOKIE_NAME =
  'SIGNED_IN_TRAINEE_ID_COOKIE_NAME';

export async function getSignedInTraineeId() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error('session is not found');
  }

  return session.user.traineeId;
}
