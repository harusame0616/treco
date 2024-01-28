import { SearchParamsDateSchema, WithSearchParams } from '@/lib/searchParams';
import { Metadata } from 'next';
import { object, parse } from 'valibot';

import { CategoriesPage } from './categories-page';

export const metadata: Metadata = {
  title: 'トレーニングカテゴリー一覧',
};
type Props = WithSearchParams;

const SearchParamsSchema = object({
  date: SearchParamsDateSchema,
});

export default function Page({ searchParams }: Props) {
  const { date } = parse(SearchParamsSchema, searchParams);

  return <CategoriesPage date={date} />;
}
