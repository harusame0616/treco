import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Tokyo');

export { dayjs as date };

export function createTZDate(date?: null | string) {
  return dayjs.tz(date ?? undefined);
}
