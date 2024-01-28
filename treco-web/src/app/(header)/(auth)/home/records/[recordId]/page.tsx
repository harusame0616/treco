import { WithParams, WithSearchParams } from '@/lib/searchParams';
import { object, optional, parse, regex, string, transform } from 'valibot';

import TrainingRecordEditPage from './_components/training-record-edit-page';
import { cachedQueryTrainingRecordEdit } from './queries';

export type Props = WithParams<'recordId', WithSearchParams>;

export const SearchParamsSchema = object({
  edit: optional(transform(string([regex(/[0-9]+/)]), Number)),
});

export async function generateMetadata({ params }: Props) {
  const { trainingEvent } = await cachedQueryTrainingRecordEdit(
    params.recordId,
  );

  return {
    title: `${trainingEvent.name} の記録`,
  };
}

export default async function Page({ params, searchParams }: Props) {
  const { edit: selectedSetIndex } = parse(SearchParamsSchema, searchParams);

  return (
    <TrainingRecordEditPage
      selectedSetIndex={selectedSetIndex}
      trainingRecordId={params.recordId}
    />
  );
}
