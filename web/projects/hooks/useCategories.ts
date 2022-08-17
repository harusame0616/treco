export interface Category {
  index: number;
  categoryId: number;
  categoryName: string;
  color: string;
}

interface UseActivitiesReturnType {
  isError: boolean;
  isLoading: boolean;
  categories: Category[];
}

const useActivities = (): UseActivitiesReturnType => {
  return {
    isLoading: false,
    isError: false,
    categories: [
      {
        index: 0,
        categoryId: 1,
        categoryName: '胸',
        color: 'red',
      },
      {
        index: 2,
        categoryId: 2,
        categoryName: '背中',
        color: 'green',
      },
      {
        index: 3,
        categoryId: 3,
        categoryName: '脚',
        color: 'blue',
      },
      {
        index: 0,
        categoryId: 4,
        categoryName: '肩',
        color: '#FFFF00',
      },
      {
        index: 0,
        categoryId: 5,
        categoryName: '腕',
        color: '#00FFFF',
      },
      {
        index: 0,
        categoryId: 5,
        categoryName: '有酸素運動',
        color: '#FF00FF',
      },
    ],
  };
};
export default useActivities;
