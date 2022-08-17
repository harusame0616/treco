import { Activity, Record } from './useActivities';
import { useCallback, useEffect, useRef, useState } from 'react';

interface WorkActivity extends Omit<Activity, 'records'> {
  records: Partial<Record>[];
}

interface UseActivityEditProp {}

const useActivityEdit = (prop: UseActivityEditProp) => {
  const [activity, setActivity] = useState<WorkActivity>({
    activityId: 1,
    categoryId: 1,
    categoryName: '胸',
    eventId: 1,
    eventName: 'ベンチプレス',
    color: 'red',
    loadUnit: 'kg',
    valueUnit: '回',
    records: [{ load: 10 }, {}, {}, {}, {}],
    date: new Date(),
    index: 0,
  });

  return {
    isLoading: false,
    isError: false,
    activity: activity,
    addNewRecord: () => {
      setActivity({
        ...activity,
        records: [...activity.records, {}],
      });
    },
    setRecord: (record: Partial<Record>, index: number) => {
      const records = [...activity.records];
      records.splice(index, 1, record);
      setActivity({
        ...activity,
        records: [...records],
      });
    },
  };
};

export default useActivityEdit;
