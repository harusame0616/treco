import useSWR from 'swr';
import { FSCategoryQuery } from '../contexts/record/infrastructure/query/fs-category-query';
import { CategoryQueryUsecase } from '../contexts/record/usecases/category-query-usecase';

const categoryQueryUsecase = new CategoryQueryUsecase({
  categoryQuery: new FSCategoryQuery(),
});

const useCategories = ({ authId }: { authId: string | undefined }) => {
  const { data, error } = useSWR(
    ['category/queryList', authId],
    (_, authId) => (authId ? categoryQueryUsecase.queryList(authId) : null),
    { refreshInterval: 200 }
  );

  return {
    isLoading: authId == null || (!error && !data),
    isError: authId != null && error,
    categories: data ?? [],
  };
};
export default useCategories;
