-- AlterTable
ALTER TABLE `users` ADD COLUMN `imageId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `images` (
    `_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `size` INTEGER NOT NULL,
    `width` INTEGER NOT NULL,
    `height` INTEGER NOT NULL,
    `mimetype` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `images`(`_id`) ON DELETE SET NULL ON UPDATE CASCADE;
