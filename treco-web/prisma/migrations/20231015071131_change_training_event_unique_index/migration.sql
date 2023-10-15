/*
  Warnings:

  - A unique constraint covering the columns `[traineeId,trainingCategoryId,order]` on the table `TrainingEvent` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TrainingEvent_traineeId_order_key";

-- CreateIndex
CREATE UNIQUE INDEX "TrainingEvent_traineeId_trainingCategoryId_order_key" ON "TrainingEvent"("traineeId", "trainingCategoryId", "order");
