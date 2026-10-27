CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` int AUTO_INCREMENT NOT NULL,
  `email` varchar(254) NOT NULL,
  `password_hash` varchar(256) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `admin_users_id` PRIMARY KEY(`id`),
  CONSTRAINT `admin_users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `career_applications` (
  `id` int AUTO_INCREMENT NOT NULL,
  `name` varchar(120) NOT NULL,
  `email` varchar(254) NOT NULL,
  `address` varchar(500) NOT NULL,
  `mobile` varchar(24) NOT NULL,
  `experience_area` enum('Sales','Production','Editorial','Accounts','DTP & Designing','HR') NOT NULL,
  `consent` boolean NOT NULL,
  `resume_object_key` varchar(100) NOT NULL,
  `resume_original_name` varchar(180) NOT NULL,
  `resume_mime_type` varchar(100) NOT NULL,
  `status` enum('new','reviewing','closed') NOT NULL DEFAULT 'new',
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `career_applications_id` PRIMARY KEY(`id`),
  INDEX `career_apps_status_created_at_idx` (`status`,`created_at`),
  INDEX `career_apps_email_idx` (`email`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `enquiries` (
  `id` int AUTO_INCREMENT NOT NULL,
  `name` varchar(120) NOT NULL,
  `email` varchar(254) NOT NULL,
  `mobile` varchar(24) NOT NULL,
  `subject` varchar(180) NOT NULL,
  `message` text NOT NULL,
  `product_slug` varchar(100),
  `consent` boolean NOT NULL,
  `status` enum('new','reviewing','closed') NOT NULL DEFAULT 'new',
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `enquiries_id` PRIMARY KEY(`id`),
  INDEX `enquiries_status_created_at_idx` (`status`,`created_at`),
  INDEX `enquiries_email_idx` (`email`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `admin_sessions` (
  `id` int AUTO_INCREMENT NOT NULL,
  `admin_id` int NOT NULL,
  `token_hash` varchar(64) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `revoked_at` timestamp NULL,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `admin_sessions_id` PRIMARY KEY(`id`),
  CONSTRAINT `admin_sessions_token_hash_unique` UNIQUE(`token_hash`),
  INDEX `admin_sessions_admin_id_idx` (`admin_id`),
  INDEX `admin_sessions_expires_at_idx` (`expires_at`),
  CONSTRAINT `admin_sessions_admin_id_admin_users_id_fk` FOREIGN KEY (`admin_id`) REFERENCES `admin_users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION
);
