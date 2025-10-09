-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "required" SET DEFAULT true;

-- AlterTable
ALTER TABLE "Survey" ADD COLUMN     "autoGenerateQuestions" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "categoryOfSurvey" TEXT;

-- CreateTable
CREATE TABLE "AIGeneratedQuestion" (
    "id" TEXT NOT NULL,
    "surveyId" TEXT NOT NULL,
    "question_type" "QuestionType" NOT NULL,
    "question_text" TEXT NOT NULL,
    "options" JSONB NOT NULL DEFAULT '[]',
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "ai_prompt" TEXT,
    "ai_model" TEXT,
    "confidence_score" DOUBLE PRECISION,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "is_added_to_survey" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIGeneratedQuestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AIGeneratedQuestion" ADD CONSTRAINT "AIGeneratedQuestion_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
