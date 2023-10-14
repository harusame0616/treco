export const trainingCategoryFixtures = [
  {
    trainingCategoryId: "82be488b-8c26-de5f-08a3-f7cb9b68a675",
    name: "胸",
    color: "#db4d6d",
    order: 0,
  },
  {
    trainingCategoryId: "83be488b-8c26-de5f-08a3-f7cb9b68a675",
    name: "背中",
    color: "#86c166",
    order: 1,
  },
  {
    trainingCategoryId: "85be488b-8c26-de5f-08a3-f7cb9b68a675",
    name: "脚",
    color: "#f596aa",
    order: 2,
  },
  {
    trainingCategoryId: "88be488b-8c26-de5f-08a3-f7cb9b68a675",
    name: "肩",
    color: "#caad5f",
    order: 3,
  },
  {
    trainingCategoryId: "92be488b-8c26-de5f-08a3-f7cb9b68a675",
    name: "腕",
    color: "#fcfaf2",
    order: 4,
  },
  {
    trainingCategoryId: "94be488b-8c26-de5f-08a3-f7cb9b68a675",
    name: "腹",
    color: "#f596aa",
    order: 5,
  },
];

export function createTrainingCategoryFixtures(traineeId: string) {
  return trainingCategoryFixtures.map((category) => ({
    ...category,
    traineeId,
  }));
}
