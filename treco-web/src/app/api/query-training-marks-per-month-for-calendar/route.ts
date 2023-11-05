import { PrismaTrainingRecordQuery } from '@/domains/training-record/infrastructures/prisma.query';
import { TrainingRecordQueryTrainingMarksPerMonthForCalendar } from '@/domains/training-record/usecases/query-training-marks-per-month-for-calendar.usecase';
import { getSignedInTraineeId } from '@/lib/trainee';
import { NextRequest } from 'next/server';
import { isoTimestamp, object, parse, string, transform } from 'valibot';

const InputSchema = object({
  date: transform(string([isoTimestamp()]), (date) => new Date(date as string)),
});

export async function GET(req: NextRequest) {
  console.log('request');
  const { date } = parse(InputSchema, {
    date: req.nextUrl.searchParams.get('date'),
  });
  const traineeId = await getSignedInTraineeId();

  const queryUsecase = new TrainingRecordQueryTrainingMarksPerMonthForCalendar(
    new PrismaTrainingRecordQuery(),
  );

  const result = await queryUsecase.execute({
    date,
    traineeId,
  });

  return Response.json(result);
}
