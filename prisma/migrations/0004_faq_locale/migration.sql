-- AlterTable
ALTER TABLE "Faq" ADD COLUMN     "locale" TEXT NOT NULL DEFAULT 'fr';

-- CreateIndex
CREATE INDEX "Faq_locale_order_idx" ON "Faq"("locale", "order");
