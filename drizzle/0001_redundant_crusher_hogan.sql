CREATE TABLE `financial_accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organizationId` int NOT NULL,
	`name` varchar(140) NOT NULL,
	`type` enum('checking','savings','credit_card','cash','investment','other') NOT NULL,
	`initialBalance` decimal(14,2) NOT NULL DEFAULT '0.00',
	`color` varchar(32) NOT NULL DEFAULT 'slate',
	`archivedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `financial_accounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `financial_transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organizationId` int NOT NULL,
	`accountId` int NOT NULL,
	`categoryId` int NOT NULL,
	`type` enum('income','expense') NOT NULL,
	`amount` decimal(14,2) NOT NULL,
	`transactionDate` timestamp NOT NULL,
	`description` varchar(240) NOT NULL,
	`createdBy` int NOT NULL,
	`updatedBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `financial_transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `organization_invitations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organizationId` int NOT NULL,
	`email` varchar(320) NOT NULL,
	`role` enum('admin','member') NOT NULL DEFAULT 'member',
	`token` varchar(96) NOT NULL,
	`status` enum('pending','accepted','revoked') NOT NULL DEFAULT 'pending',
	`expiresAt` timestamp NOT NULL,
	`invitedBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `organization_invitations_id` PRIMARY KEY(`id`),
	CONSTRAINT `organization_invitation_token_idx` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `organization_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organizationId` int NOT NULL,
	`userId` int NOT NULL,
	`role` enum('admin','member') NOT NULL DEFAULT 'member',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `organization_members_id` PRIMARY KEY(`id`),
	CONSTRAINT `organization_membership_idx` UNIQUE(`organizationId`,`userId`)
);
--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`slug` varchar(180) NOT NULL,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `organizations_id` PRIMARY KEY(`id`),
	CONSTRAINT `organizations_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `transaction_audit_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organizationId` int NOT NULL,
	`transactionId` int NOT NULL,
	`actorUserId` int NOT NULL,
	`action` enum('created','updated','deleted','imported') NOT NULL,
	`beforeData` text,
	`afterData` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `transaction_audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transaction_categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organizationId` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`type` enum('income','expense','both') NOT NULL DEFAULT 'both',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `transaction_categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `transaction_categories_org_name_idx` UNIQUE(`organizationId`,`name`)
);
--> statement-breakpoint
CREATE INDEX `financial_accounts_org_idx` ON `financial_accounts` (`organizationId`);--> statement-breakpoint
CREATE INDEX `financial_transactions_org_date_idx` ON `financial_transactions` (`organizationId`,`transactionDate`);--> statement-breakpoint
CREATE INDEX `financial_transactions_account_idx` ON `financial_transactions` (`accountId`);--> statement-breakpoint
CREATE INDEX `financial_transactions_category_idx` ON `financial_transactions` (`categoryId`);--> statement-breakpoint
CREATE INDEX `organization_invitation_org_email_idx` ON `organization_invitations` (`organizationId`,`email`);--> statement-breakpoint
CREATE INDEX `organization_members_user_idx` ON `organization_members` (`userId`);--> statement-breakpoint
CREATE INDEX `organizations_created_by_idx` ON `organizations` (`createdBy`);--> statement-breakpoint
CREATE INDEX `transaction_audit_transaction_idx` ON `transaction_audit_logs` (`transactionId`);--> statement-breakpoint
CREATE INDEX `transaction_audit_org_idx` ON `transaction_audit_logs` (`organizationId`);