import { PrismaTrainingRecordQuery } from '@/domains/training-record/infrastructures/prisma.query';
import { TrainingRecordQueryListForHomeUsecase } from '@/domains/training-record/usecases/query-list-for-home.usecase';
import { getSignedInTraineeId } from '@/lib/trainee';

import { Calendar } from './_component/calendar';

async function queryTrainingRecord(traineeId: string, date: Date) {
  const query = new TrainingRecordQueryListForHomeUsecase(
    new PrismaTrainingRecordQuery(),
  );

  return await query.execute(traineeId, date);
}

type Props = {
  searchParams: {
    date?: string;
  };
};
export default async function HomePage({ searchParams }: Props) {
  const traineeId = await getSignedInTraineeId();
  const selectedDate = searchParams.date
    ? new Date(searchParams.date)
    : new Date();

  return (
    <div className="flex h-full flex-col">
      <div className="bg-muted p-4">
        <Calendar />
      </div>
      <div className="flex flex-col overflow-hidden p-4">
        <div className="overflow-auto">
          <TrainingRecords date={selectedDate} traineeId={traineeId} />
        </div>
      </div>
    </div>
  );
}

async function TrainingRecords({
  date,
  traineeId,
}: {
  date: Date;
  traineeId: string;
}) {
  const trainingRecords = await queryTrainingRecord(traineeId, date);

  return (
    <ul className="flex flex-col gap-4">
      {trainingRecords.map((record) => (
        <li key={record.trainingRecordId}>
          <div className="mb-2 flex items-center">
            <span
              aria-hidden="true"
              className="mr-1"
              style={{ color: record.trainingCategory.color }}
            >
              ●
            </span>
            {`${record.trainingCategory.name} - ${record.trainingEvent.name}`}
          </div>
          <ul className="rounded-md bg-muted p-4">
            {record.sets.map((set, index) => (
              <li className="flex gap-2" key={index}>
                <div className="mb-[3px] flex w-4 items-end justify-end text-xs text-muted-foreground">
                  {index + 1}
                </div>
                <div className="w-12 text-right text-lg">
                  {set.load}
                  <span className="ml-1 text-xs text-muted-foreground">
                    {record.trainingEvent.loadUnit}
                  </span>
                </div>
                <div className="mr-4 w-12 text-right text-lg">
                  {set.value}
                  <span className="ml-1 text-xs text-muted-foreground">
                    {record.trainingEvent.valueUnit}
                  </span>
                </div>
                <div className="grow text-lg">{set.note}</div>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
