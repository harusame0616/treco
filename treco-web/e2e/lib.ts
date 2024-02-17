import crypto from 'crypto';

export function generateUniqueString() {
  return crypto.randomUUID();
}
