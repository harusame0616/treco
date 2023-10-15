-- CreateTable
CREATE TABLE "Trainee" (
    "traineeId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "authId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trainee_pkey" PRIMARY KEY ("traineeId")
);

-- CreateTable
CREATE TABLE "TrainingCategory" (
    "trainingCategoryId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "traineeId" UUID NOT NULL,

    CONSTRAINT "TrainingCategory_pkey" PRIMARY KEY ("trainingCategoryId")
);

-- CreateTable
CREATE TABLE "TrainingEvent" (
    "trainingEventId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "loadUnit" TEXT NOT NULL,
    "valueUnit" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "traineeId" UUID NOT NULL,
    "trainingCategoryId" UUID NOT NULL,

    CONSTRAINT "TrainingEvent_pkey" PRIMARY KEY ("trainingEventId")
);

-- CreateTable
CREATE TABLE "TrainingRecord" (
    "trainingRecordId" UUID NOT NULL,
    "trainingDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "traineeId" UUID NOT NULL,
    "trainingEventId" UUID NOT NULL,

    CONSTRAINT "TrainingRecord_pkey" PRIMARY KEY ("trainingRecordId")
);

-- CreateTable
CREATE TABLE "TrainingSet" (
    "trainingRecordId" UUID NOT NULL,
    "order" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "load" INTEGER NOT NULL,
    "note" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingSet_pkey" PRIMARY KEY ("trainingRecordId","order")
);

-- CreateIndex
CREATE UNIQUE INDEX "Trainee_authId_key" ON "Trainee"("authId");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingCategory_traineeId_order_key" ON "TrainingCategory"("traineeId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingEvent_traineeId_order_key" ON "TrainingEvent"("traineeId", "order");

-- AddForeignKey
ALTER TABLE "TrainingCategory" ADD CONSTRAINT "TrainingCategory_traineeId_fkey" FOREIGN KEY ("traineeId") REFERENCES "Trainee"("traineeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingEvent" ADD CONSTRAINT "TrainingEvent_traineeId_fkey" FOREIGN KEY ("traineeId") REFERENCES "Trainee"("traineeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingEvent" ADD CONSTRAINT "TrainingEvent_trainingCategoryId_fkey" FOREIGN KEY ("trainingCategoryId") REFERENCES "TrainingCategory"("trainingCategoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingRecord" ADD CONSTRAINT "TrainingRecord_traineeId_fkey" FOREIGN KEY ("traineeId") REFERENCES "Trainee"("traineeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingRecord" ADD CONSTRAINT "TrainingRecord_trainingEventId_fkey" FOREIGN KEY ("trainingEventId") REFERENCES "TrainingEvent"("trainingEventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingSet" ADD CONSTRAINT "TrainingSet_trainingRecordId_fkey" FOREIGN KEY ("trainingRecordId") REFERENCES "TrainingRecord"("trainingRecordId") ON DELETE RESTRICT ON UPDATE CASCADE;
