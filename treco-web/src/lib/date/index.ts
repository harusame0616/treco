import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Tokyo');

export function utcDate(config?: dayjs.ConfigType) {
  return dayjs.utc(config);
}

// TODO: クライアントの timezone を考慮する
export function formatDate(date: Date, formatString: string) {
  return dayjs(date).add(9, 'h').format(formatString);
}
