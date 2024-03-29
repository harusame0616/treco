import { WithParams, WithSearchParams } from '@/lib/searchParams';
import { object, optional, parse, regex, string, transform } from 'valibot';

import TrainingRecordEditPage from './_components/training-record-edit-page';

type Props = WithParams<'recordId', WithSearchParams>;

const SearchParamsSchema = object({
  edit: optional(transform(string([regex(/[0-9]+/)]), Number)),
});

export async function generateMetadata() {
  return {
    title: 'トレーニングを記録',
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
