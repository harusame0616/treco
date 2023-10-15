import { cookies } from 'next/headers';

export const SIGNED_IN_TRAINEE_ID_COOKIE_NAME =
  'SIGNED_IN_TRAINEE_ID_COOKIE_NAME';

export async function getSignedInTraineeId() {
  const traineeId = cookies().get(SIGNED_IN_TRAINEE_ID_COOKIE_NAME)?.value;
  if (!traineeId) {
    throw new Error('No signed in trainee Id');
  }

  return traineeId;
}
