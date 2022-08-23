import {
  collection,
  doc,
  getDoc,
  getDocFromCache,
  getDocs,
  getDocsFromCache,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { fbDb } from '../../../../utils/firebase';
import {
  TrainingEvent,
  TrainingEventDto,
} from '../../domains/training-event/training-event';
import { TrainingEventRepository } from '../../usecases/training-event-command-usecase';

export class FSTrainigEventRepository implements TrainingEventRepository {
  async save(trainingEvent: TrainingEvent) {
    const dto = trainingEvent.toDto();

    await setDoc(
      doc(fbDb, 'users', dto.userId, 'trainingEvents', dto.trainingEventId),
      dto
    );
  }

  async findOneByTrainingEventId(prop: {
    userId: string;
    categoryId: string;
    trainingEventId: string;
  }): Promise<TrainingEvent | null> {
    const docRef = doc(
      fbDb,
      'users',
      prop.userId,
      'trainingEvents',
      prop.trainingEventId
    );

    let trainigEventDto = await getDocFromCache(docRef);
    if (!trainigEventDto.exists()) {
      trainigEventDto = await getDoc(docRef);
    }

    return trainigEventDto.exists()
      ? TrainingEvent.fromDto(trainigEventDto.data() as any)
      : null;
  }

  async findOneByTrainingEventName(prop: {
    userId: string;
    categoryId: string;
    trainingEventName: string;
  }): Promise<TrainingEvent | null> {
    const collectionRef = collection(
      fbDb,
      'users',
      prop.userId,
      'trainingEvents'
    );

    const trainingEventNameQuery = query(
      collectionRef,
      where('trainingEventName', '==', prop.trainingEventName)
    );

    let trainingEvents = await getDocsFromCache(trainingEventNameQuery);
    if (!trainingEvents.empty) {
      trainingEvents = await getDocs(trainingEventNameQuery);
    }

    return trainingEvents.empty
      ? null
      : TrainingEvent.fromDto(trainingEvents.docs[0].data() as any);
  }
}
