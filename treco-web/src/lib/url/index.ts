import { headers } from 'next/headers';

export function getOrigin() {
  if (typeof window === 'object') {
    return `${window.location.protocol}//${window.location.host}`;
  }

  return `https://${headers().get('host')}`;
}
