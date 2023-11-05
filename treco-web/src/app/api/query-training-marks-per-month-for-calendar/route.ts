import { PrismaTrainingRecordQuery } from '@/domains/training-record/infrastructures/prisma.query';
import { TrainingRecordQueryTrainingMarksForCalendar } from '@/domains/training-record/usecases/query-training-marks-for-calendar.usecase';
import { getSignedInTraineeId } from '@/lib/trainee';
import { NextRequest } from 'next/server';
import { isoTimestamp, object, parse, string, transform } from 'valibot';

const isoTimestampSchema = transform(
  string([isoTimestamp()]),
  (date) => new Date(date as string),
);

const InputSchema = object({
  end: isoTimestampSchema,
  start: isoTimestampSchema,
});

export async function GET(req: NextRequest) {
  const { end, start } = parse(
    InputSchema,
    Object.fromEntries(req.nextUrl.searchParams.entries()),
  );
  const traineeId = await getSignedInTraineeId();

  const queryUsecase = new TrainingRecordQueryTrainingMarksForCalendar(
    new PrismaTrainingRecordQuery(),
  );

  const result = await queryUsecase.execute({
    end,
    start,
    traineeId,
  });

  return Response.json(result);
}
