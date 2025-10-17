/*
  Warnings:

  - The values [MCQ,RATING,FILE,MATRIX] on the enum `QuestionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `media` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `options` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `subCategoryId` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `answer_type` on the `ResponseAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `media` on the `ResponseAnswer` table. All the data in the column will be lost.
  - You are about to drop the column `categoryOfSurvey` on the `Survey` table. All the data in the column will be lost.
  - You are about to drop the `QuestionSubCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `gridOptions` to the `ResponseAnswer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "QuestionType_new" AS ENUM ('TEXT', 'IMAGE', 'VIDEO', 'AUDIO');
ALTER TABLE "Question" ALTER COLUMN "question_type" TYPE "QuestionType_new" USING ("question_type"::text::"QuestionType_new");
ALTER TABLE "AIGeneratedQuestion" ALTER COLUMN "question_type" TYPE "QuestionType_new" USING ("question_type"::text::"QuestionType_new");
ALTER TYPE "QuestionType" RENAME TO "QuestionType_old";
ALTER TYPE "QuestionType_new" RENAME TO "QuestionType";
DROP TYPE "QuestionType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_subCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionSubCategory" DROP CONSTRAINT "QuestionSubCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Survey" DROP CONSTRAINT "Survey_categoryOfSurvey_fkey";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "media",
DROP COLUMN "options",
DROP COLUMN "subCategoryId",
ADD COLUMN     "mediaId" TEXT;

-- AlterTable
ALTER TABLE "QuestionCategory" ADD COLUMN     "settings" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "ResponseAnswer" DROP COLUMN "answer_type",
DROP COLUMN "media",
ADD COLUMN     "gridOptions" JSONB NOT NULL,
ADD COLUMN     "mediaId" TEXT;

-- AlterTable
ALTER TABLE "Survey" DROP COLUMN "categoryOfSurvey",
ADD COLUMN     "surveyCategoryId" TEXT;

-- DropTable
DROP TABLE "QuestionSubCategory";

-- CreateTable
CREATE TABLE "Option" (
    "id" TEXT NOT NULL,
    "text" TEXT,
    "mediaId" TEXT,
    "questionId" TEXT NOT NULL,
    "rowQuestionOptionId" TEXT NOT NULL,
    "columnQuestionOptionId" TEXT NOT NULL,
    "rangeFrom" INTEGER,
    "rangeTo" INTEGER,
    "fromLabel" TEXT,
    "toLabel" TEXT,
    "icon" TEXT,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OptionToResponseAnswer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Option_mediaId_key" ON "Option"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "_OptionToResponseAnswer_AB_unique" ON "_OptionToResponseAnswer"("A", "B");

-- CreateIndex
CREATE INDEX "_OptionToResponseAnswer_B_index" ON "_OptionToResponseAnswer"("B");

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_surveyCategoryId_fkey" FOREIGN KEY ("surveyCategoryId") REFERENCES "SurveyCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_rowQuestionOptionId_fkey" FOREIGN KEY ("rowQuestionOptionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_columnQuestionOptionId_fkey" FOREIGN KEY ("columnQuestionOptionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseAnswer" ADD CONSTRAINT "ResponseAnswer_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OptionToResponseAnswer" ADD CONSTRAINT "_OptionToResponseAnswer_A_fkey" FOREIGN KEY ("A") REFERENCES "Option"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OptionToResponseAnswer" ADD CONSTRAINT "_OptionToResponseAnswer_B_fkey" FOREIGN KEY ("B") REFERENCES "ResponseAnswer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
