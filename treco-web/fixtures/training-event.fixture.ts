import { TrainingEventDto } from '@/domains/training-event/models/training-event';
import { trainingCategoryFixtures } from './training-category.fixture';

export const trainingEventFixtures = [
  {
    trainingEventId: 'd4fd917c-86c9-895e-5a8c-2490e04dd600',
    name: 'ベンチプレス',
    categoryName: '胸',
    loadUnit: 'kg',
    valueUnit: '回',
    order: 1,
  },
  {
    trainingEventId: 'd5fd917c-86c9-895e-5a8c-2490e04dd600',
    categoryName: '胸',
    name: 'ダンベルプレス',
    loadUnit: 'kg',
    valueUnit: '回',
    order: 2,
  },
  {
    trainingEventId: 'd6fd917c-86c9-895e-5a8c-2490e04dd600',
    categoryName: '胸',
    name: 'ダンベルフライ',
    loadUnit: 'kg',
    valueUnit: '回',
    order: 3,
  },
  {
    trainingEventId: 'd7fd917c-86c9-895e-5a8c-2490e04dd600',
    name: 'ケーブルクロスオーバー',
    categoryName: '胸',
    loadUnit: 'kg',
    valueUnit: '回',
    order: 4,
  },
  {
    trainingEventId: 'd8fd917c-86c9-895e-5a8c-2490e04dd600',
    categoryName: '胸',
    name: 'ケーブルフライ',
    loadUnit: 'kg',
    valueUnit: '回',
    order: 5,
  },
  {
    trainingEventId: 'd9fd917c-86c9-895e-5a8c-2490e04dd600',
    categoryName: '胸',
    name: 'チェストプレスマシン',
    loadUnit: 'kg',
    valueUnit: '回',
    order: 6,
  },
  {
    trainingEventId: 'd9fd918c-86c9-895e-5a8c-2490e04dd600',
    categoryName: '胸',
    name: 'バタフライマシン',
    loadUnit: 'kg',
    valueUnit: '回',
    order: 7,
  },
  {
    trainingEventId: 'a0fd918c-86c9-895e-5a8c-2490e04dd600',
    categoryName: '胸',
    name: '腕立てふせ',
    loadUnit: 'kg',
    valueUnit: '回',
    order: 8,
  },
  {
    trainingEventId: 'a1fd918c-86c9-895e-5a8c-2490e04dd600',
    categoryName: '脚',
    name: 'バーベルスクワット',
    loadUnit: 'kg',
    valueUnit: '回',
    order: 0,
  },
  {
    trainingEventId: 'a2fd918c-86c9-895e-5a8c-2490e04dd600',
    categoryName: '脚',
    name: 'ブルガリアンスクワット',
    loadUnit: 'kg',
    valueUnit: '回',
    order: 1,
  },
  {
    trainingEventId: 'a3fd918c-86c9-895e-5a8c-2490e04dd600',
    categoryName: '脚',
    name: 'ヒップスラスト',
    loadUnit: 'kg',
    valueUnit: '回',
    order: 2,
  },
  {
    trainingEventId: 'a4fd918c-86c9-895e-5a8c-2490e04dd600',
    categoryName: '脚',
    name: 'レッグプレス',
    loadUnit: 'kg',
    valueUnit: '回',
    order: 3,
  },
  {
    trainingEventId: 'a5fd918c-86c9-895e-5a8c-2490e04dd600',
    categoryName: '脚',
    name: 'ハムストリングカール',
    loadUnit: 'kg',
    valueUnit: '回',
    order: 4,
  },
  {
    trainingEventId: 'a6fd918c-86c9-895e-5a8c-2490e04dd600',
    categoryName: '脚',
    name: 'レッグエクステンション',
    loadUnit: 'kg',
    valueUnit: '回',
    order: 5,
  },
  {
    trainingEventId: 'a7fd918c-86c9-895e-5a8c-2490e04dd600',
    categoryName: '脚',
    name: 'レッグレイズ',
    loadUnit: 'kg',
    valueUnit: '回',
    order: 6,
  },
  {
    trainingEventId: 'a8fd918c-86c9-895e-5a8c-2490e04dd600',
    categoryName: '脚',
    name: 'ランジ',
    loadUnit: 'kg',
    valueUnit: '回',
    order: 7,
  },
  {
    trainingEventId: 'b0fd918c-86c9-895e-5a8c-2490e04dd60a',
    categoryName: '腹',
    name: 'アブローラー',
    loadUnit: 'kg',
    valueUnit: '回',
    order: 0,
  },
  {
    trainingEventId: 'b1fd918c-86c9-895e-5a8c-2490e04dd60a',
    categoryName: '腹',
    name: 'プランク',
    loadUnit: 'kg',
    valueUnit: '分',
    order: 1,
  },
  {
    trainingEventId: 'b2fd918c-86c9-895e-5a8c-2490e04dd60a',
    categoryName: '腹',
    name: 'シットアップ',
    loadUnit: 'kg',
    valueUnit: '回',
    order: 2,
  },
  {
    trainingEventId: 'b3fd918c-86c9-895e-5a8c-2490e04dd60a',
    categoryName: '腹',
    name: 'レッグレイズ',
    loadUnit: 'kg',
    valueUnit: '回',
    order: 3,
  },
  {
    trainingEventId: 'b4fd918c-86c9-895e-5a8c-2490e04dd60a',
    categoryName: '肩',
    name: 'ショルダープレス',
    loadUnit: 'kg',
    valueUnit: '回 ',
    order: 0,
  },
  {
    trainingEventId: 'b5fd918c-86c9-895e-5a8c-2490e04dd60a',
    categoryName: '肩',
    name: 'サイドレイズ',
    loadUnit: 'kg',
    valueUnit: '回 ',
    order: 1,
  },
  {
    trainingEventId: 'b6fd918c-86c9-895e-5a8c-2490e04dd60a',
    categoryName: '肩',
    name: 'リアレイズ',
    loadUnit: 'kg',
    valueUnit: '回 ',
    order: 2,
  },
  {
    trainingEventId: 'b7fd918c-86c9-895e-5a8c-2490e04dd60a',
    categoryName: '肩',
    name: 'フロントレイズ',
    loadUnit: 'kg',
    valueUnit: '回 ',
    order: 3,
  },
  {
    trainingEventId: 'b8fd918c-86c9-895e-5a8c-2490e04dd60a',
    categoryName: '肩',
    name: 'アップライトロウ',
    loadUnit: 'kg',
    valueUnit: '回 ',
    order: 4,
  },
  {
    trainingEventId: 'b9fd918c-86c9-895e-5a8c-2490e04dd60a',
    categoryName: '背中',
    name: 'デッドリフト',
    loadUnit: 'kg',
    valueUnit: '回',
    order: 5,
  },
  {
    trainingEventId: 'c0fd918c-86c9-895e-5a8c-2490e04dd60a',
    categoryName: '背中',
    name: 'ベントオーバーロー',
    loadUnit: 'kg',
    valueUnit: '回',
    order: 6,
  },
  {
    trainingEventId: 'c1fd918c-86c9-895e-5a8c-2490e04dd60a',
    categoryName: '背中',
    name: 'ラットプルダウン',
    loadUnit: 'kg',
    valueUnit: '回',
    order: 7,
  },
  {
    trainingEventId: 'c2fd918c-86c9-895e-5a8c-2490e04dd60a',
    categoryName: '背中',
    name: 'シーテッドローイング',
    loadUnit: 'kg',
    valueUnit: '回',
    order: 8,
  },
  {
    trainingEventId: 'c3fd918c-86c9-895e-5a8c-2490e04dd60a',
    categoryName: '背中',
    name: 'チンニング',
    loadUnit: 'kg',
    valueUnit: '回',
    order: 9,
  },
  {
    trainingEventId: 'c4fd918c-86c9-895e-5a8c-2490e04dd60a',
    categoryName: '背中',
    name: 'バックエクステンション',
    loadUnit: 'kg',
    valueUnit: '回',
    order: 10,
  },
];

export function createTrainingEventFixtures(
  categories: typeof trainingCategoryFixtures,
  traineeId: string
): TrainingEventDto[] {
  return trainingEventFixtures.map((event) => {
    const trainingCategoryId = categories.find(
      (category) => category.name === event.categoryName
    )?.trainingCategoryId;

    if (!trainingCategoryId) {
      console.error('training category id is not found', {
        func: createTrainingEventFixtures.name,
        data: {
          event,
          categories,
        },
      });
      throw new Error('training category id is not found');
    }

    return {
      ...event,
      trainingCategoryId,
      traineeId,
    };
  });
}
