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
      activityDto
    );
  }

  async save(activity: Activity) {
    const { records, ...activityInfo } = activity.toDto();

    const recordsCollectionRef = collection(
      fbDb,
      'users',
      activityInfo.userId,
      'activities',
      activityInfo.activityId,
      'records'
    );

    const recordsSnapshot = await getDocsFromCache(recordsCollectionRef);
    if (!recordsSnapshot.empty) {
      Promise.all(
        recordsSnapshot.docs.map((document) =>
          deleteDoc(
            doc(
              fbDb,
              'users',
              activityInfo.userId,
              'activities',
              activityInfo.activityId,
              'records',
              document.id
            )
          )
        )
      );
    }

    await Promise.all(
      records.map((record, index) =>
        addDoc(
          collection(
            fbDb,
            'users',
            activityInfo.userId,
            'activities',
            activityInfo.activityId,
            'records'
          ),
          { ...activityInfo, ...record, index }
        )
      )
    );
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
