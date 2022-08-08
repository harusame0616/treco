interface ActivityOfDays {
  [key: string]: Activity;
}

export interface Activity {
  activityId: number;
  categoryId: number;
  categoryName: string;
  eventId: number;
  eventName: string;
  color: string;
  loadUnit: string;
  valueUnit: string;
  records: Record[];
  date: Date;
  index: number;
}

interface Record {
  load: number;
  value: number;
  note: string;
}
interface UseActivitiesReturnType {
  isError: boolean;
  isLoading: boolean;
  activities: Activity[];
}

const useActivities = (month: Date): UseActivitiesReturnType => {
  return {
    isLoading: false,
    isError: false,
    activities: [
      {
        index: 0,
        activityId: 1,
        categoryId: 1,
        categoryName: '胸',
        eventId: 1,
        eventName: 'ベンチプレス',
        color: 'red',
        loadUnit: 'kg',
        valueUnit: '回',
        records: [
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
        ],
        date: new Date(),
      },
      {
        index: 1,
        date: new Date(),
        activityId: 2,
        categoryId: 1,
        categoryName: '胸',
        eventId: 2,
        eventName: 'インクラインベンチプレス',
        color: 'red',
        loadUnit: 'kg',
        valueUnit: '回',
        records: [
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
        ],
      },
      {
        index: 2,
        date: new Date(),
        activityId: 3,
        categoryId: 2,
        categoryName: '背中',
        eventId: 3,
        eventName: 'デッドリフト',
        color: 'green',
        loadUnit: 'kg',
        valueUnit: '回',
        records: [
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
        ],
      },
      {
        index: 3,
        date: new Date(),
        activityId: 4,
        categoryId: 2,
        categoryName: '背中',
        eventId: 4,
        eventName: 'ラットプルダウン',
        color: 'green',
        loadUnit: 'kg',
        valueUnit: '回',
        records: [
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
        ],
      },
      {
        index: 4,
        date: new Date(),
        activityId: 5,
        categoryId: 3,
        categoryName: '脚',
        eventId: 5,
        eventName: 'バーベルスクワット',
        color: 'blue',
        loadUnit: 'kg',
        valueUnit: '回',
        records: [
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
        ],
      },
      {
        index: 5,
        date: new Date(),
        activityId: 6,
        categoryId: 3,
        categoryName: '脚',
        eventId: 6,
        eventName: 'ランジ',
        color: 'blue',
        loadUnit: 'kg',
        valueUnit: '回',
        records: [
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
        ],
      },
      {
        index: 6,
        date: new Date(),
        activityId: 7,
        categoryId: 4,
        categoryName: '肩',
        eventId: 7,
        eventName: 'ショルダープレス',
        color: '#FFFF00',
        loadUnit: 'kg',
        valueUnit: '回',
        records: [
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
        ],
      },
      {
        index: 7,
        date: new Date(),
        activityId: 8,
        categoryId: 5,
        categoryName: '腕',
        eventId: 8,
        eventName: 'ダンベルカール',
        color: '#00FFFF',
        loadUnit: 'kg',
        valueUnit: '回',
        records: [
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
        ],
      },
      {
        index: 8,
        date: new Date(),
        activityId: 9,
        categoryId: 6,
        categoryName: '有酸素',
        eventId: 9,
        eventName: '室内ジョギング',
        color: '#FF00FF',
        loadUnit: 'kg',
        valueUnit: '回',
        records: [
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
        ],
      },
      {
        index: 9,
        date: new Date(),
        activityId: 10,
        categoryId: 7,
        categoryName: 'オリジナル',
        eventId: 10,
        eventName: '室内ジョギング',
        color: '#fFaaff',
        loadUnit: 'km/h',
        valueUnit: '分',
        records: [
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
          { load: 20.0, value: 10, note: '' },
        ],
      },
    ],
  };
};
export default useActivities;
