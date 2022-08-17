export interface Event {
  index: number;
  categoryId: number;
  categoryName: string;
  color: string;
  eventId: number;
  eventName: string;
}

interface UseActivitiesReturnType {
  isError: boolean;
  isLoading: boolean;
  events: Event[];
}

interface UseEventsProp {
  categoryId: number | null;
}

const sampleEventsMappedCategoryId = [
  [
    {
      index: 0,
      categoryId: 0,
      categoryName: '胸',
      color: 'red',
      eventId: 0,
      eventName: 'ベンチプレス',
    },
    {
      index: 1,
      categoryId: 0,
      categoryName: '胸',
      color: 'red',
      eventId: 1,
      eventName: 'インクラインベンチプレス',
    },
  ],
  [
    {
      index: 0,
      categoryId: 1,
      categoryName: '背中',
      color: 'blue',
      eventId: 2,
      eventName: 'デッドリフト',
    },
    {
      index: 0,
      categoryId: 1,
      categoryName: '背中',
      color: 'blue',
      eventId: 3,
      eventName: 'ラットプルダウン',
    },
  ],
  [],
  [],
  [],
  [],
  [],
];

const useEvents = (prop: UseEventsProp): UseActivitiesReturnType => {
  console.log({ prop }, sampleEventsMappedCategoryId);
  return {
    isLoading: prop.categoryId == null,
    isError: false,
    events: prop.categoryId
      ? sampleEventsMappedCategoryId[prop.categoryId]
      : [],
  };
};
export default useEvents;
