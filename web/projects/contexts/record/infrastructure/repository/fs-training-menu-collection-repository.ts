import { TrainingMenuCollection } from '@Domains/training-menu/training-menu-collection';
import { TrainingMenuCollectionRepository } from '@Usecases/training-menu-collection-usecase';
import { setDoc } from 'firebase/firestore';
import {
  fsConfigDocRef,
  fsTrainingMenuDocRef,
  fsTrainingMenusCollectionRef,
  getDocManagedCache,
  getDocsManagedCache,
} from '../firestore-utils';

export class FSTrainingMenuRepository
  implements TrainingMenuCollectionRepository
{
  async findByUserId(prop: {
    userId: string;
  }): Promise<TrainingMenuCollection> {
    const [trainingMenusSnapshot, trainingMenuConfigSnapshot] =
      await Promise.all([
        getDocsManagedCache(fsTrainingMenusCollectionRef(prop)),
        getDocManagedCache(
          fsConfigDocRef({ ...prop, configId: 'trainingMenu' })
        ),
      ]);

    const trainingMenuMappedTrainingMenuId = Object.fromEntries(
      trainingMenusSnapshot.docs.map((doc) => [doc.id, doc.data()])
    );

    const trainingMenusSorted = trainingMenuConfigSnapshot?.data
      ? trainingMenuConfigSnapshot
          .data?.()
          ?.orders.map(
            (trainingMenuId: string) =>
              trainingMenuMappedTrainingMenuId[trainingMenuId]
          )
      : [];

    return TrainingMenuCollection.fromDto({
      userId: prop.userId,
      trainingMenus: trainingMenusSorted,
    });
  }

  async save(trainingMenuCollection: TrainingMenuCollection): Promise<void> {
    const { userId, trainingMenus } = trainingMenuCollection.toDto();

    // ドメインオブジェクト上で削除されたトレーニングメニューはDBから明示的に削除しない。
    // データは残りっぱなしになるため、復元時にconfigのorderに載っていないトレーニングメニューは再構成しないようにする
    const orders = trainingMenus.map(({ trainingMenuId }) => trainingMenuId);
    await Promise.all([
      setDoc(fsConfigDocRef({ userId, configId: 'trainingMenu' }), { orders }),
      ...trainingMenus.map((trainingMenu) =>
        setDoc(fsTrainingMenuDocRef(trainingMenu), trainingMenu)
      ),
    ]);
  }
}
