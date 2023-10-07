import dayjs from 'dayjs';
import { Calendar } from './_component/calendar';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default async function HomePage() {
  return (
    <div>
      <div className="calendar p-4 bg-muted">
        <Calendar />
      </div>
    </div>
  );
}
