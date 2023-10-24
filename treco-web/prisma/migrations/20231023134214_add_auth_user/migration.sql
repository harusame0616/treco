/*
  Warnings:

  - You are about to drop the column `authId` on the `Trainee` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Trainee_authId_key";

-- AlterTable
ALTER TABLE "Trainee" DROP COLUMN "authId";

-- CreateTable
CREATE TABLE "AuthUser" (
    "authUserId" UUID NOT NULL,
    "traineeId" UUID NOT NULL,
    "sub" VARCHAR(255) NOT NULL,
    "email" VARCHAR(1024) NOT NULL,

    CONSTRAINT "AuthUser_pkey" PRIMARY KEY ("authUserId")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthUser_traineeId_key" ON "AuthUser"("traineeId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthUser_sub_key" ON "AuthUser"("sub");

-- CreateIndex
CREATE UNIQUE INDEX "AuthUser_email_key" ON "AuthUser"("email");

-- AddForeignKey
ALTER TABLE "AuthUser" ADD CONSTRAINT "AuthUser_traineeId_fkey" FOREIGN KEY ("traineeId") REFERENCES "Trainee"("traineeId") ON DELETE RESTRICT ON UPDATE CASCADE;
