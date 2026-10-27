ALTER TABLE `career_applications` MODIFY COLUMN `status` enum('new','reviewing','contacted','closed') NOT NULL DEFAULT 'new';--> statement-breakpoint
ALTER TABLE `enquiries` MODIFY COLUMN `status` enum('new','reviewing','contacted','closed') NOT NULL DEFAULT 'new';--> statement-breakpoint
ALTER TABLE `career_applications` ADD `notification_status` enum('not_configured','pending','sent','failed') DEFAULT 'not_configured' NOT NULL;--> statement-breakpoint
ALTER TABLE `enquiries` ADD `notification_status` enum('not_configured','pending','sent','failed') DEFAULT 'not_configured' NOT NULL;