/*
  Warnings:

  - You are about to drop the column `gridOptions` on the `ResponseAnswer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ResponseAnswer" DROP COLUMN "gridOptions",
ADD COLUMN     "scaleRatingValue" INTEGER;

-- CreateTable
CREATE TABLE "GridResponseAnswer" (
    "id" TEXT NOT NULL,
    "responseAnswerId" TEXT NOT NULL,
    "rowOptionId" TEXT NOT NULL,
    "columnOptionId" TEXT NOT NULL,
    "selected" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "GridResponseAnswer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GridResponseAnswer" ADD CONSTRAINT "GridResponseAnswer_responseAnswerId_fkey" FOREIGN KEY ("responseAnswerId") REFERENCES "ResponseAnswer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
