-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_categoryOfSurvey_fkey" FOREIGN KEY ("categoryOfSurvey") REFERENCES "SurveyCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
