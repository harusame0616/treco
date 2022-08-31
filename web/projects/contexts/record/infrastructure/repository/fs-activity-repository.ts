import {
  deleteDoc,
  doc,
  getDoc,
  getDocFromCache,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { fbDb } from '../../../../utils/firebase';
import { Activity } from '../../domains/activity/activity';
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
    const activityDto = activity.toDto();

    await updateDoc(
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

  async findOne(prop: {
    userId: string;
    categoryId: string;
    trainingEventId: string;
    activityId: string;
  }): Promise<Activity | null> {
    console.log('findone', { prop });
    const activityDocRef = doc(
      fbDb,
      'users',
      prop.userId,
      'activities',
      prop.activityId
    );

    let activity = await getDocFromCache(activityDocRef);
    if (!activity.exists()) {
      activity = await getDoc(activityDocRef);
    }

    return activity.exists() ? Activity.fromDto(activity.data() as any) : null;
  }
}
