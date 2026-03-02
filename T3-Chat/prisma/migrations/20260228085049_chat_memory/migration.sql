/*
  Warnings:

  - You are about to drop the column `isArchived` on the `conversation` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `conversation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shareId]` on the table `conversation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "conversation_userId_idx";

-- DropIndex
DROP INDEX "conversation_userId_isPinned_updatedAt_idx";

-- DropIndex
DROP INDEX "conversation_userId_updatedAt_idx";

-- AlterTable
ALTER TABLE "conversation" DROP COLUMN "isArchived",
DROP COLUMN "projectId",
ADD COLUMN     "isShared" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shareId" TEXT,
ALTER COLUMN "modelId" DROP NOT NULL,
ALTER COLUMN "modelName" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "conversation_shareId_key" ON "conversation"("shareId");

-- CreateIndex
CREATE INDEX "conversation_shareId_idx" ON "conversation"("shareId");
