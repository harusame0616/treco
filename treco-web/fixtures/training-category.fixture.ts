export const trainingCategoryFixtures = [
  {
    color: '#db4d6d',
    name: '胸',
    order: 0,
    trainingCategoryId: '82be488b-8c26-de5f-08a3-f7cb9b68a675',
  },
  {
    color: '#86c166',
    name: '背中',
    order: 1,
    trainingCategoryId: '83be488b-8c26-de5f-08a3-f7cb9b68a675',
  },
  {
    color: '#f596aa',
    name: '脚',
    order: 2,
    trainingCategoryId: '85be488b-8c26-de5f-08a3-f7cb9b68a675',
  },
  {
    color: '#caad5f',
    name: '肩',
    order: 3,
    trainingCategoryId: '88be488b-8c26-de5f-08a3-f7cb9b68a675',
  },
  {
    color: '#fcfaf2',
    name: '腕',
    order: 4,
    trainingCategoryId: '92be488b-8c26-de5f-08a3-f7cb9b68a675',
  },
  {
    color: '#f596aa',
    name: '腹',
    order: 5,
    trainingCategoryId: '94be488b-8c26-de5f-08a3-f7cb9b68a675',
  },
];

export function createTrainingCategoryFixtures(traineeId: string) {
  return trainingCategoryFixtures.map((category) => ({
    ...category,
    traineeId,
  }));
}
