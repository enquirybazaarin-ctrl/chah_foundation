-- DropIndex
DROP INDEX `donors_email_key` ON `donors`;

-- AlterTable
ALTER TABLE `donations` ADD COLUMN `created_by_id` BIGINT UNSIGNED NULL,
    ADD COLUMN `donor_message` TEXT NULL,
    ADD COLUMN `is_anonymous` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `status` ENUM('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `donors` ADD COLUMN `donor_number` VARCHAR(191) NOT NULL,
    MODIFY `email` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `number_sequences` (
    `name` VARCHAR(191) NOT NULL,
    `current_value` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `donations_created_by_id_idx` ON `donations`(`created_by_id`);

-- CreateIndex
CREATE UNIQUE INDEX `donors_donor_number_key` ON `donors`(`donor_number`);

-- CreateIndex
CREATE INDEX `donors_donor_number_idx` ON `donors`(`donor_number`);

-- AddForeignKey
ALTER TABLE `donations` ADD CONSTRAINT `donations_created_by_id_fkey` FOREIGN KEY (`created_by_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
