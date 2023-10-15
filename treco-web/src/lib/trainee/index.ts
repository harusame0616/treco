import { cookies } from 'next/headers';

export const SIGNED_IN_TRAINEE_ID_COOKIE_NAME =
  'SIGNED_IN_TRAINEE_ID_COOKIE_NAME';

export async function getSignedInTraineeId() {
  return cookies().get(SIGNED_IN_TRAINEE_ID_COOKIE_NAME)?.value;
}
