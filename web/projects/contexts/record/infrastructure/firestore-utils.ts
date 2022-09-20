import { fbDb } from '@/utils/firebase';
import { ActivityFullId } from '@Domains/activity/activity';
import { CategoryFullId } from '@Domains/category/category';
import { TrainingEventFullId } from '@Domains/training-event/training-event';
import { TrainingMenuFullId } from '@Domains/training-menu/training-menu';
import {
  collection,
  doc,
  DocumentReference,
  getDoc,
  getDocFromCache,
  getDocs,
  getDocsFromCache,
  Query,
} from 'firebase/firestore';

export const fsTrainingMenusCollectionRef = (
  prop: Omit<TrainingMenuFullId, 'trainingMenuId'>
) => {
  return collection(fbDb, 'users', prop.userId, 'trainingMenus');
};

export const fsTrainingMenuDocRef = (prop: TrainingMenuFullId) => {
  return doc(fbDb, 'users', prop.userId, 'trainingMenus', prop.trainingMenuId);
};

export const fsTrainingEventCollectionRef = (
  prop: Omit<TrainingEventFullId, 'trainingEventId' | 'categoryId'>
) => {
  return collection(fbDb, 'users', prop.userId, 'trainingEvents');
};

export const fsTrainingEventDocRef = (
  prop: Omit<TrainingEventFullId, 'categoryId'>
) => {
  return doc(
    fbDb,
    'users',
    prop.userId,
    'trainingEvents',
    prop.trainingEventId
  );
};

export const fsCategoryCollection = (
  prop: Omit<CategoryFullId, 'categoryId'>
) => {
  return collection(fbDb, 'users', prop.userId, 'categories');
};

export const fsCategoryDoc = (
  prop: CategoryFullId
) => {
  return doc(fbDb, 'users', prop.userId, 'categories', prop.categoryId);
};

export const fsActivityCollection = (
  prop: Omit<ActivityFullId, 'trainingEventId' | 'categoryId' | 'activityId'>
) => {
  return collection(fbDb, 'users', prop.userId, 'activities');
};

export const fsActivityDoc = (
  prop: Omit<ActivityFullId, 'trainingEventId' | 'categoryId'>
) => {
  return doc(fbDb, 'users', prop.userId, 'activities', prop.activityId);
};

export const fsRecordsCollection = (prop: {
  userId: string;
  activityId: string;
}) => {
  return collection(
    fbDb,
    'users',
    prop.userId,
    'activities',
    prop.activityId,
    'records'
  );
};

export const fsRecordDoc = (prop: {
  userId: string;
  activityId: string;
  recordId: string;
}) => {
  return doc(
    fbDb,
    'users',
    prop.userId,
    'activities',
    prop.activityId,
    'records',
    prop.recordId
  );
};

export const fsConfigDocRef = (prop: { userId: string; configId: string }) => {
  return doc(fbDb, 'users', prop.userId, 'configs', prop.configId);
};

export const getDocsManagedCache = async <T>(query: Query<T>) => {
  let snapshot = await getDocsFromCache(query);
  if (snapshot.empty) {
    snapshot = await getDocs(query);
  }

  return snapshot;
};

export const getDocManagedCache = async <T>(ref: DocumentReference<T>) => {
  let snapshot;
  try {
    snapshot = await getDocFromCache(ref);
  } catch {
    snapshot = await getDoc(ref);
  }

  return snapshot || null;
};
