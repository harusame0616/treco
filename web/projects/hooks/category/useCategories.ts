import { RequireError } from '@Errors/require-error';
import { FSCategoryQuery } from '@Queries/fs-category-query';
import { CategoryQueryUsecase } from '@Usecases/category-query-usecase';
import useSWR from 'swr';

const categoryQueryUsecase = new CategoryQueryUsecase({
  categoryQuery: new FSCategoryQuery(),
});

interface Prop {
  userId?: string;
}

const useCategories = (prop: Prop) => {
  const { data, error, mutate } = useSWR(
    ['category/queryList', prop.userId],
    (_, userId) => {
      if (!userId) {
        throw new RequireError('ユーザーID');
      }

      return categoryQueryUsecase.queryList(userId);
    }
  );

  if (!error && !data) {
    return {
      isLoading: true as const,
      isError: false as const,
      categories: null,
    };
  }

  if (error) {
    return {
      isLoading: false as const,
      isError: true as const,
      categories: null,
      error,
    };
  }

  return {
    isLoading: false as const,
    isError: false as const,
    categories: data ?? [],
    async refresh() {
      await mutate();
    },
  };
};

export default useCategories;
