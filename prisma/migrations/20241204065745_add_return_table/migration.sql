/*
  Warnings:

  - You are about to drop the column `createdAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `user` table. All the data in the column will be lost.
  - The values [Admin,Member] on the enum `User_role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `borrow` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inventory` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `borrow` DROP FOREIGN KEY `borrow_item_id_fkey`;

-- DropForeignKey
ALTER TABLE `borrow` DROP FOREIGN KEY `borrow_user_id_fkey`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `createdAt`,
    DROP COLUMN `name`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    ALTER COLUMN `username` DROP DEFAULT,
    ALTER COLUMN `password` DROP DEFAULT,
    MODIFY `role` ENUM('ADMIN', 'USER') NOT NULL;

-- DropTable
DROP TABLE `borrow`;

-- DropTable
DROP TABLE `inventory`;

-- CreateTable
CREATE TABLE `Items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BorrowRecord` (
    `borrow_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `item_id` INTEGER NOT NULL,
    `borrow_date` DATETIME(3) NOT NULL,
    `return_date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`borrow_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReturnRecord` (
    `return_id` INTEGER NOT NULL AUTO_INCREMENT,
    `borrow_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `item_id` INTEGER NOT NULL,
    `actual_return_date` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ReturnRecord_borrow_id_key`(`borrow_id`),
    PRIMARY KEY (`return_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_email_key` ON `User`(`email`);

-- AddForeignKey
ALTER TABLE `BorrowRecord` ADD CONSTRAINT `BorrowRecord_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BorrowRecord` ADD CONSTRAINT `BorrowRecord_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `Items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReturnRecord` ADD CONSTRAINT `ReturnRecord_borrow_id_fkey` FOREIGN KEY (`borrow_id`) REFERENCES `BorrowRecord`(`borrow_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReturnRecord` ADD CONSTRAINT `ReturnRecord_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReturnRecord` ADD CONSTRAINT `ReturnRecord_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `Items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RedefineIndex
CREATE UNIQUE INDEX `User_username_key` ON `User`(`username`);
DROP INDEX `user_username_key` ON `user`;
