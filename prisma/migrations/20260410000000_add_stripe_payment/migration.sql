-- Drop old card columns and add stripePaymentIntentId
-- Existing test rows are cleared first to avoid constraint violations

DELETE FROM `payments`;

ALTER TABLE `payments`
    DROP COLUMN `cardNumber`,
    DROP COLUMN `expDate`,
    DROP COLUMN `CVV`,
    ADD COLUMN `stripePaymentIntentId` VARCHAR(255) NOT NULL;

ALTER TABLE `payments`
    ADD UNIQUE INDEX `payments_stripePaymentIntentId_key`(`stripePaymentIntentId`);
