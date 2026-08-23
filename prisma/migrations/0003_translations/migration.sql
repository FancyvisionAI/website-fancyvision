-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "translationEditedAt" TIMESTAMP(3),
ADD COLUMN     "translationGeneratedAt" TIMESTAMP(3),
ADD COLUMN     "translationOfId" TEXT,
ADD COLUMN     "translationSourceHash" TEXT,
ADD COLUMN     "translationStatus" TEXT;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "translationEditedAt" TIMESTAMP(3),
ADD COLUMN     "translationGeneratedAt" TIMESTAMP(3),
ADD COLUMN     "translationOfId" TEXT,
ADD COLUMN     "translationSourceHash" TEXT,
ADD COLUMN     "translationStatus" TEXT;

-- AlterTable
ALTER TABLE "Training" ADD COLUMN     "translationEditedAt" TIMESTAMP(3),
ADD COLUMN     "translationGeneratedAt" TIMESTAMP(3),
ADD COLUMN     "translationOfId" TEXT,
ADD COLUMN     "translationSourceHash" TEXT,
ADD COLUMN     "translationStatus" TEXT;

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "translationEditedAt" TIMESTAMP(3),
ADD COLUMN     "translationGeneratedAt" TIMESTAMP(3),
ADD COLUMN     "translationOfId" TEXT,
ADD COLUMN     "translationSourceHash" TEXT,
ADD COLUMN     "translationStatus" TEXT;

-- AlterTable
ALTER TABLE "CaseStudy" ADD COLUMN     "translationEditedAt" TIMESTAMP(3),
ADD COLUMN     "translationGeneratedAt" TIMESTAMP(3),
ADD COLUMN     "translationOfId" TEXT,
ADD COLUMN     "translationSourceHash" TEXT,
ADD COLUMN     "translationStatus" TEXT;

-- CreateIndex
CREATE INDEX "Page_translationOfId_idx" ON "Page"("translationOfId");

-- CreateIndex
CREATE INDEX "Service_translationOfId_idx" ON "Service"("translationOfId");

-- CreateIndex
CREATE INDEX "Training_translationOfId_idx" ON "Training"("translationOfId");

-- CreateIndex
CREATE INDEX "Article_translationOfId_idx" ON "Article"("translationOfId");

-- CreateIndex
CREATE INDEX "CaseStudy_translationOfId_idx" ON "CaseStudy"("translationOfId");

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_translationOfId_fkey" FOREIGN KEY ("translationOfId") REFERENCES "Page"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_translationOfId_fkey" FOREIGN KEY ("translationOfId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Training" ADD CONSTRAINT "Training_translationOfId_fkey" FOREIGN KEY ("translationOfId") REFERENCES "Training"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_translationOfId_fkey" FOREIGN KEY ("translationOfId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseStudy" ADD CONSTRAINT "CaseStudy_translationOfId_fkey" FOREIGN KEY ("translationOfId") REFERENCES "CaseStudy"("id") ON DELETE SET NULL ON UPDATE CASCADE;
