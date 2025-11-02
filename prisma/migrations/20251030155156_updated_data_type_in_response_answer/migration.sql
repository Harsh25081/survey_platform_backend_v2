/*
  Warnings:

  - The `answer_value` column on the `ResponseAnswer` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ResponseAnswer" DROP COLUMN "answer_value",
ADD COLUMN     "answer_value" JSONB;
