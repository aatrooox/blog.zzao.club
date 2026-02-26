CREATE TABLE `blog_todo_comment` (
	`id` varchar(255) NOT NULL,
	`todo_item_id` varchar(255) NOT NULL,
	`author_user_id` varchar(255) NOT NULL,
	`content` mediumtext NOT NULL,
	`created_at` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `blog_todo_comment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blog_todo_event` (
	`id` int AUTO_INCREMENT NOT NULL,
	`todo_item_id` varchar(255) NOT NULL,
	`actor_user_id` varchar(255) NOT NULL,
	`event_type` varchar(100) NOT NULL,
	`payload` json DEFAULT ('{}'),
	`created_at` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `blog_todo_event_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blog_todo_item` (
	`id` varchar(255) NOT NULL,
	`title` varchar(500) NOT NULL,
	`description` mediumtext,
	`status` varchar(50) NOT NULL DEFAULT 'open',
	`visibility` varchar(50) NOT NULL DEFAULT 'public',
	`reporter_user_id` varchar(255) NOT NULL,
	`target_type` varchar(50) DEFAULT 'none',
	`target_ref` varchar(1000),
	`target_title` varchar(500),
	`due_at` datetime,
	`completed_at` datetime,
	`created_at` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `blog_todo_item_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blog_todo_participant` (
	`id` varchar(255) NOT NULL,
	`todo_item_id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`role` varchar(50) NOT NULL DEFAULT 'watcher',
	`status` varchar(50) NOT NULL DEFAULT 'active',
	`created_at` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `blog_todo_participant_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_todo_participant_todo_item_id_user_id_unique` UNIQUE(`todo_item_id`,`user_id`)
);
--> statement-breakpoint
CREATE TABLE `blog_todo_tag_relation` (
	`todo_item_id` varchar(255) NOT NULL,
	`tag_id` varchar(255) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `blog_todo_tag_relation_todo_item_id_tag_id_pk` PRIMARY KEY(`todo_item_id`,`tag_id`)
);
--> statement-breakpoint
CREATE TABLE `blog_todo_tag` (
	`id` varchar(255) NOT NULL,
	`name` varchar(100) NOT NULL,
	`color` varchar(50) DEFAULT 'neutral',
	`created_at` datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `blog_todo_tag_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_todo_tag_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE INDEX `todo_comment_todo_item_idx` ON `blog_todo_comment` (`todo_item_id`);--> statement-breakpoint
CREATE INDEX `todo_event_todo_item_idx` ON `blog_todo_event` (`todo_item_id`);--> statement-breakpoint
CREATE INDEX `todo_event_cursor_idx` ON `blog_todo_event` (`id`);--> statement-breakpoint
CREATE INDEX `todo_event_created_at_idx` ON `blog_todo_event` (`created_at`);--> statement-breakpoint
CREATE INDEX `todo_item_status_idx` ON `blog_todo_item` (`status`);--> statement-breakpoint
CREATE INDEX `todo_item_visibility_idx` ON `blog_todo_item` (`visibility`);--> statement-breakpoint
CREATE INDEX `todo_item_reporter_idx` ON `blog_todo_item` (`reporter_user_id`);--> statement-breakpoint
CREATE INDEX `todo_item_updated_at_idx` ON `blog_todo_item` (`updated_at`);--> statement-breakpoint
CREATE INDEX `todo_participant_todo_item_idx` ON `blog_todo_participant` (`todo_item_id`);--> statement-breakpoint
CREATE INDEX `todo_participant_user_idx` ON `blog_todo_participant` (`user_id`);