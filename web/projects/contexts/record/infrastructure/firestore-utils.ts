import { fbDb } from '@/utils/firebase';
import {
    collection,
    doc,
    DocumentReference,
    getDoc,
    getDocFromCache,
    getDocs,
    getDocsFromCache, Query
} from 'firebase/firestore';

export const fsTrainingMenusCollectionRef = (prop: any) => {
  return collection(fbDb, 'users', prop.userId, 'trainingMenus');
};

export const fsTrainingMenuDocRef = (prop: any) => {
  return doc(fbDb, 'users', prop.userId, 'trainingMenus', prop.trainingMenuId);
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
