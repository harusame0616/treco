import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocFromCache,
  getDocs,
  getDocsFromCache,
  setDoc,
} from 'firebase/firestore';
import { fbDb } from '../../../../utils/firebase';
import { Activity, ActivityFullId } from '../../domains/activity/activity';
import { ActivityRepository } from '../../usecases/activity-command-usecase';
import {
  fsActivityDoc,
  fsRecordDoc,
  fsRecordsCollection,
  getDocsManagedCache,
} from '../firestore-utils';

export class FSActivityRepository implements ActivityRepository {
  async delete(activity: Activity): Promise<void> {
    const activityDto = activity.toDto();
    const activityDocRef = doc(
      fbDb,
      'users',
      activityDto.userId,
      'activities',
      activityDto.activityId
    );

    return deleteDoc(activityDocRef);
  }

  async insert(activity: Activity) {
    const activityDto = activity.toDto();
    await setDoc(
      doc(
        fbDb,
        'users',
        activityDto.userId,
        'activities',
        activityDto.activityId
      ),
      {
        ...activityDto,
        maxRM: 0,
        maxLoad: 0,
      }
    );
  }

  async save(activity: Activity) {
    const { records, ...activityInfo } = activity.toDto();

    const [maxRM, maxLoad] = records.reduce(
      ([prevmaxRM, prevMaxLoad], record) => {
        const rm = record.load * (1 + record.value / 40);
        return [
          rm > prevmaxRM ? rm : prevmaxRM,
          record.load > prevMaxLoad ? record.load : prevMaxLoad,
        ];
      },
      [0, 0]
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

    await Promise.all([
      setDoc(fsActivityDoc(activityInfo), {
        ...activityInfo,
        records: [],
        maxRM,
        maxLoad,
      }),
      ...records.map((record, index) =>
        addDoc(fsRecordsCollection(activityInfo), {
          ...activityInfo,
          ...record,
          index,
        })
      ),
    ]);
  }

  async findOne(prop: ActivityFullId): Promise<Activity | null> {
    const activityDocRef = doc(
      fbDb,
      'users',
      prop.userId,
      'activities',
      prop.activityId
    );
    const recordsCollectionRef = collection(
      fbDb,
      'users',
      prop.userId,
      'activities',
      prop.activityId,
      'records'
    );

    let activity = await getDocFromCache(activityDocRef);
    if (!activity.exists()) {
      activity = await getDoc(activityDocRef);
    }

    let recordsSnapshot = await getDocsFromCache(recordsCollectionRef);
    if (recordsSnapshot.empty) {
      recordsSnapshot = await getDocs(recordsCollectionRef);
    }

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
