/*
  Warnings:

  - Made the column `lastMessageAt` on table `conversation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "conversation" ALTER COLUMN "lastMessageAt" SET NOT NULL,
ALTER COLUMN "lastMessageAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "conversation_userId_lastMessageAt_idx" ON "conversation"("userId", "lastMessageAt" DESC);
