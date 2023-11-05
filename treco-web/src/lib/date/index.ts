import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Tokyo');

export { dayjs as date };

export function createDate(date?: Date | null | string) {
  return dayjs(date).tz('Asia/Tokyo');
}
