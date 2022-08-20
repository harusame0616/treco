import useSWR from 'swr';
import { FSCategoryQuery } from '../contexts/record/infrastructure/query/fs-category-query';
import { CategoryQueryUsecase } from '../contexts/record/usecases/category-query-usecase';

const categoryQueryUsecase = new CategoryQueryUsecase({
  categoryQuery: new FSCategoryQuery(),
});

const useCategory = (prop: {
  userId?: string | null;
  categoryId?: string | null;
}) => {
  const { data, error } = useSWR(
    ['category/queryDetail', prop.userId, prop.categoryId],
    (_, userId, categoryId) => {
      if (!userId || !categoryId) {
        throw new ParameterError('userId and categoryId is required');
      }
      return categoryQueryUsecase.queryDetail(userId, categoryId);
    }
  );

  return {
    isLoading: !prop.userId || !prop.categoryId || (!error && !data),
    isError: prop.userId && prop.categoryId && error,
    category: data,
  };
};
export default useCategory;
