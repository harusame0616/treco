/*
  Warnings:

  - You are about to drop the column `traineeId` on the `AuthUser` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[authUserId]` on the table `Trainee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authUserId` to the `Trainee` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AuthUser" DROP CONSTRAINT "AuthUser_traineeId_fkey";

-- DropIndex
DROP INDEX "AuthUser_traineeId_key";

-- AlterTable
ALTER TABLE "AuthUser" DROP COLUMN "traineeId";

-- AlterTable
ALTER TABLE "Trainee" ADD COLUMN     "authUserId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Trainee_authUserId_key" ON "Trainee"("authUserId");

-- AddForeignKey
ALTER TABLE "Trainee" ADD CONSTRAINT "Trainee_authUserId_fkey" FOREIGN KEY ("authUserId") REFERENCES "AuthUser"("authUserId") ON DELETE RESTRICT ON UPDATE CASCADE;
