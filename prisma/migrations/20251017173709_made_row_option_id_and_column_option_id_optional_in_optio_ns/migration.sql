-- DropForeignKey
ALTER TABLE "Option" DROP CONSTRAINT "Option_columnQuestionOptionId_fkey";

-- DropForeignKey
ALTER TABLE "Option" DROP CONSTRAINT "Option_rowQuestionOptionId_fkey";

-- AlterTable
ALTER TABLE "Option" ALTER COLUMN "rowQuestionOptionId" DROP NOT NULL,
ALTER COLUMN "columnQuestionOptionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_rowQuestionOptionId_fkey" FOREIGN KEY ("rowQuestionOptionId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_columnQuestionOptionId_fkey" FOREIGN KEY ("columnQuestionOptionId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;
