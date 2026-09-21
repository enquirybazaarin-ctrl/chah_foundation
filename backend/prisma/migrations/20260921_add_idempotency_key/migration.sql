-- AlterTable
ALTER TABLE `donations` ADD COLUMN `idempotency_key` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `donations_idempotency_key_key` ON `donations`(`idempotency_key`);
