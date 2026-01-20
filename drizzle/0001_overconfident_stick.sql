CREATE TABLE `positions` (
	`id` varchar(64) NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`latitude` varchar(20) NOT NULL,
	`longitude` varchar(20) NOT NULL,
	`accuracy` varchar(20),
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `positions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` varchar(64) NOT NULL,
	`userId` int NOT NULL,
	`startTime` timestamp NOT NULL DEFAULT (now()),
	`limitTime` timestamp NOT NULL,
	`deadline` timestamp NOT NULL,
	`tolerance` int NOT NULL,
	`status` enum('active','grace','overdue','returned','cancelled') NOT NULL DEFAULT 'active',
	`note` text,
	`endTime` timestamp,
	`extensionsCount` int NOT NULL DEFAULT 0,
	`checkInConfirmed` int NOT NULL DEFAULT 0,
	`checkInConfirmedAt` timestamp,
	`alertTriggeredAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `smsLogs` (
	`id` varchar(64) NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`phoneNumber` varchar(20) NOT NULL,
	`message` text NOT NULL,
	`status` enum('pending','sent','delivered','failed') NOT NULL DEFAULT 'pending',
	`messageSid` varchar(64),
	`sentAt` timestamp,
	`deliveredAt` timestamp,
	`failureReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `smsLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userPreferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`firstName` varchar(100),
	`emergencyContact1Name` varchar(100),
	`emergencyContact1Phone` varchar(20),
	`emergencyContact2Name` varchar(100),
	`emergencyContact2Phone` varchar(20),
	`tolerance` int NOT NULL DEFAULT 15,
	`locationEnabled` int NOT NULL DEFAULT 0,
	`notificationsEnabled` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userPreferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `userPreferences_userId_unique` UNIQUE(`userId`)
);
