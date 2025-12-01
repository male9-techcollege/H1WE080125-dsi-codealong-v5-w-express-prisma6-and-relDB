/*
  Warnings:

  - You are about to drop the column `brand` on the `car` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `car` table. All the data in the column will be lost.
  - Added the required column `brand_id` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_id` to the `Car` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `car` DROP COLUMN `brand`,
    DROP COLUMN `category`,
    ADD COLUMN `brand_id` INTEGER NOT NULL,
    ADD COLUMN `category_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Car` ADD CONSTRAINT `Car_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Car` ADD CONSTRAINT `Car_brand_id_fkey` FOREIGN KEY (`brand_id`) REFERENCES `Brand`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
