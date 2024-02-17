import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

export function useToday() {
  const [today, setToday] = useState<Date>();

  useEffect(() => {
    setToday(dayjs().startOf('day').toDate());
  }, []);

  return { today };
}
