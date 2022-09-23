import { addDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { Activity, ActivityFullId } from '../../domains/activity/activity';
import { ActivityRepository } from '../../usecases/activity-command-usecase';
import {
  fsActivityDoc,
  fsRecordDoc,
  fsRecordsCollection,
  getDocManagedCache,
  getDocsManagedCache,
} from '../firestore-utils';

export class FSActivityRepository implements ActivityRepository {
  async delete(activity: Activity): Promise<void> {
    const activityDto = activity.toDto();
    const activityDocRef = fsActivityDoc(activityDto);

    return deleteDoc(activityDocRef);
  }

  async insert(activity: Activity) {
    const activityDto = activity.toDto();
    await setDoc(fsActivityDoc(activityDto), {
      ...activityDto,
      maxRM: 0,
      maxLoad: 0,
      maxValue: 0,
      totalLoad: 0,
      totalValue: 0,
    });
  }

  async save(activity: Activity) {
    const { records, ...activityInfo } = activity.toDto();

    const [maxRM, maxLoad, maxValue, totalLoad, totalValue] = records.reduce(
      (
        [prevmaxRM, prevMaxLoad, prevMaxValue, prevTotalLoad, prevTotalValue],
        record
      ) => {
        const rm = record.load * (1 + record.value / 40);
        return [
          rm > prevmaxRM ? rm : prevmaxRM,
          record.load > prevMaxLoad ? record.load : prevMaxLoad,
          record.value > prevMaxValue ? record.value : prevMaxValue,
          prevTotalLoad + record.load * record.value,
          prevTotalValue + record.value,
        ];
      },
      [0, 0, 0, 0, 0]
    );

    const recordsCollectionRef = fsRecordsCollection(activityInfo);
    const recordsSnapshot = await getDocsManagedCache(recordsCollectionRef);
    if (!recordsSnapshot.empty) {
      await Promise.all(
        recordsSnapshot.docs.map((document) =>
          deleteDoc(fsRecordDoc({ ...activityInfo, recordId: document.id }))
        )
      );
    }

    const { createdAt, ...activityInfoExceptCreateAt } = activityInfo;
    await Promise.all([
      setDoc(
        fsActivityDoc(activityInfo),
        {
          ...activityInfo,
          records: [],
          maxRM,
          maxLoad,
          maxValue,
          totalLoad,
          totalValue,
        },
        { merge: true }
      ),
      ...records.map((record, index) =>
        addDoc(fsRecordsCollection(activityInfo), {
          ...activityInfoExceptCreateAt,
          ...record,
          index,
        })
      ),
    ]);
  }

  async findOne(prop: ActivityFullId): Promise<Activity | null> {
    const activityDocRef = fsActivityDoc(prop);
    const recordsCollectionRef = fsRecordsCollection(prop);

    let [activity, recordsSnapshot] = await Promise.all([
      getDocManagedCache(activityDocRef),
      getDocsManagedCache(recordsCollectionRef),
    ]);

    return activity.exists()
      ? Activity.fromDto({
          ...(activity.data() as any),
          records: recordsSnapshot.empty
            ? []
            : recordsSnapshot.docs.map((doc) => doc.data()),
        })
      : null;
  }
}
