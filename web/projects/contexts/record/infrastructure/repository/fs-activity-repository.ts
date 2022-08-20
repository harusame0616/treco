import {
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
  async insert(activity: Activity) {
    const activityDto = activity.toDto();
    await setDoc(
      doc(
        fbDb,
        'users',
        activityDto.userId,
        'categories',
        activityDto.categoryId,
        'trainingEvents',
        activityDto.trainingEventId,
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
        'categories',
        activityDto.categoryId,
        'trainingEvents',
        activityDto.trainingEventId,
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
    const activityDocRef = doc(
      fbDb,
      'users',
      prop.userId,
      'categories',
      prop.categoryId,
      'trainingEvents',
      prop.trainingEventId,
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
