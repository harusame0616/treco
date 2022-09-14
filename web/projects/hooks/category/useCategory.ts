import { CategoryDto } from '@Domains/category/category';
import { RequireError } from '@Errors/require-error';
import { FSCategoryQuery } from '@Queries/fs-category-query';
import { CategoryQueryUsecase } from '@Usecases/category-query-usecase';
import useSWR from 'swr';

const categoryQueryUsecase = new CategoryQueryUsecase({
  categoryQuery: new FSCategoryQuery(),
});

const useCategory = (prop: { userId?: string; categoryId?: string }) => {
  const { data, error } = useSWR(
    ['category/queryDetail', prop.userId, prop.categoryId],
    (_, userId, categoryId) => {
      if (!userId) {
        throw new RequireError('ユーザーID');
      }
      if (!categoryId) {
        throw new RequireError('カテゴリID');
      }
      return categoryQueryUsecase.queryDetail(userId, categoryId);
    }
  );

  if (!error && !data) {
    return {
      isLoading: true as const,
      isError: false as const,
      category: null,
    };
  }

  if (error) {
    return {
      isLoading: false as const,
      isError: true as const,
      error,
      category: null,
    };
  }

  return {
    isLoading: false as const,
    isError: false as const,
    category: data as CategoryDto,
  };
};

export default useCategory;
