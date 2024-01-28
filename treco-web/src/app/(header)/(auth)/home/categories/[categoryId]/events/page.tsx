import {
  SearchParamsDateSchema,
  WithParams,
  WithSearchParams,
} from '@/lib/searchParams';
import { object, parse } from 'valibot';

import { TrainingEventsPage } from './_components/training-events-page';
import { cachedQueryCategory } from './_queries/queries';

type Props = WithSearchParams<WithParams<'categoryId'>>;

const SearchParamsSchema = object({
  date: SearchParamsDateSchema,
});

export async function generateMetadata({ params }: Props) {
  const category = await cachedQueryCategory(params.categoryId);

  return {
    title: `${category?.name}のトレーニング種目一覧`,
  };
}

export default function Page({ params, searchParams }: Props) {
  const { date } = parse(SearchParamsSchema, searchParams);
  const categoryId = params.categoryId;

  return <TrainingEventsPage categoryId={categoryId} date={date} />;
}
