-- DropForeignKey
ALTER TABLE "TrainingEvent" DROP CONSTRAINT "TrainingEvent_trainingCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "TrainingRecord" DROP CONSTRAINT "TrainingRecord_trainingEventId_fkey";

-- DropForeignKey
ALTER TABLE "TrainingSet" DROP CONSTRAINT "TrainingSet_trainingRecordId_fkey";

-- AddForeignKey
ALTER TABLE "TrainingEvent" ADD CONSTRAINT "TrainingEvent_trainingCategoryId_fkey" FOREIGN KEY ("trainingCategoryId") REFERENCES "TrainingCategory"("trainingCategoryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingRecord" ADD CONSTRAINT "TrainingRecord_trainingEventId_fkey" FOREIGN KEY ("trainingEventId") REFERENCES "TrainingEvent"("trainingEventId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingSet" ADD CONSTRAINT "TrainingSet_trainingRecordId_fkey" FOREIGN KEY ("trainingRecordId") REFERENCES "TrainingRecord"("trainingRecordId") ON DELETE CASCADE ON UPDATE CASCADE;
