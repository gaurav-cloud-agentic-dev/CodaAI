/*
  Warnings:

  - You are about to drop the `project` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `modelId` on table `conversation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `modelName` on table `conversation` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('normal', 'error', 'tool_call');

-- DropForeignKey
ALTER TABLE "conversation" DROP CONSTRAINT "conversation_projectId_fkey";

-- DropIndex
DROP INDEX "conversation_userId_isPinned_updatedAt_idx";

-- DropIndex
DROP INDEX "conversation_userId_updatedAt_idx";

-- AlterTable
ALTER TABLE "conversation" ALTER COLUMN "title" DROP DEFAULT,
ALTER COLUMN "modelId" SET NOT NULL,
ALTER COLUMN "modelName" SET NOT NULL;

-- AlterTable
ALTER TABLE "message" ADD COLUMN     "errorDetails" TEXT,
ADD COLUMN     "messageType" "MessageType" NOT NULL DEFAULT 'normal',
ADD COLUMN     "toolCallData" JSONB;

-- DropTable
DROP TABLE "project";

-- CreateIndex
CREATE INDEX "conversation_userId_updatedAt_idx" ON "conversation"("userId", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "conversation_userId_isPinned_updatedAt_idx" ON "conversation"("userId", "isPinned", "updatedAt" DESC);
