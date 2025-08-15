CREATE TABLE `blog_access_token` (
	`id` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`roles` varchar(255) NOT NULL DEFAULT 'user',
	`status` int NOT NULL DEFAULT 1,
	`scope` varchar(255) NOT NULL DEFAULT 'all',
	`isRevoked` boolean NOT NULL DEFAULT false,
	`ip` varchar(255),
	`expiresAt` datetime NOT NULL,
	`createdAt` datetime NOT NULL DEFAULT '2025-08-15 09:03:52.955',
	`updatedAt` datetime NOT NULL DEFAULT '2025-08-15 09:03:52.955',
	CONSTRAINT `blog_access_token_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_access_token_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `blog_comment` (
	`id` varchar(255) NOT NULL,
	`content` mediumtext NOT NULL,
	`create_ts` datetime NOT NULL DEFAULT '2025-08-15 09:03:52.955',
	`updated_ts` datetime NOT NULL DEFAULT '2025-08-15 09:03:52.956',
	`type` varchar(50) NOT NULL DEFAULT 'article',
	`quoteContent` text,
	`article_id` varchar(255),
	`user_id` varchar(255),
	`visitorName` varchar(255),
	`memo_id` varchar(255),
	CONSTRAINT `blog_comment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blog_explain` (
	`id` varchar(255) NOT NULL,
	`create_ts` datetime NOT NULL DEFAULT '2025-08-15 09:03:52.956',
	`updated_ts` datetime NOT NULL DEFAULT '2025-08-15 09:03:52.956',
	`text` mediumtext NOT NULL,
	`content` mediumtext NOT NULL,
	`article_id` varchar(255) NOT NULL,
	CONSTRAINT `blog_explain_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blog_like` (
	`id` int AUTO_INCREMENT NOT NULL,
	`create_ts` datetime NOT NULL DEFAULT '2025-08-15 09:03:52.956',
	`updated_ts` datetime NOT NULL DEFAULT '2025-08-15 09:03:52.956',
	`target` varchar(50) NOT NULL DEFAULT 'article',
	`article_id` varchar(255),
	`sub_comment_id` varchar(255),
	`comment_id` varchar(255),
	`user_id` varchar(255) NOT NULL,
	`blogMemoId` varchar(255),
	CONSTRAINT `blog_like_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blog_memos` (
	`id` varchar(255) NOT NULL,
	`content` mediumtext,
	`create_ts` datetime NOT NULL DEFAULT '2025-08-15 09:03:52.956',
	`updated_ts` datetime NOT NULL DEFAULT '2025-08-15 09:03:52.956',
	`visible` varchar(50) NOT NULL DEFAULT 'public',
	`defalt_floded` boolean NOT NULL DEFAULT false,
	`flod_tip` varchar(255),
	`user_id` varchar(255) NOT NULL,
	`from` varchar(255),
	`courier` varchar(255),
	CONSTRAINT `blog_memos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blog_sub_comment` (
	`id` varchar(255) NOT NULL,
	`content` mediumtext NOT NULL,
	`create_ts` datetime NOT NULL DEFAULT '2025-08-15 09:03:52.956',
	`updated_ts` datetime NOT NULL DEFAULT '2025-08-15 09:03:52.956',
	`comment_id` varchar(255) NOT NULL,
	`reply_sub_comment_id` varchar(255),
	`user_id` varchar(255),
	CONSTRAINT `blog_sub_comment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `blog_garmin_activity` (
	`id` varchar(255) NOT NULL,
	`activity_type` varchar(255) NOT NULL,
	`date` datetime NOT NULL,
	`is_favorite` boolean NOT NULL,
	`title` varchar(255),
	`distance` decimal(8,2),
	`calories` int NOT NULL,
	`duration` decimal(10,2) NOT NULL,
	`moving_time` decimal(10,2),
	`elapsed_time` decimal(10,2),
	`avg_hr` int,
	`max_hr` int,
	`aerobic_effect` decimal(3,1),
	`training_stress_score` decimal(5,1),
	`avg_pace` decimal(5,2),
	`best_pace` decimal(5,2),
	`total_strokes` int,
	`avg_swolf` int,
	`avg_stroke_rate` int,
	`steps` int,
	`total_reps` int,
	`total_sets` int,
	`is_grit` boolean,
	`best_lap_time` decimal(8,2),
	`lap_count` int,
	`created_at` datetime NOT NULL DEFAULT '2025-08-15 09:03:52.956',
	`updated_at` datetime NOT NULL DEFAULT '2025-08-15 09:03:52.956',
	CONSTRAINT `blog_garmin_activity_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_garmin_activity_date_activity_type_unique` UNIQUE(`date`,`activity_type`)
);
--> statement-breakpoint
CREATE TABLE `blog_memo_tag_relations` (
	`tagId` varchar(255) NOT NULL,
	`memoId` varchar(255) NOT NULL,
	`create_ts` datetime NOT NULL DEFAULT '2025-08-15 09:03:52.956',
	`updated_ts` datetime NOT NULL DEFAULT '2025-08-15 09:03:52.956',
	CONSTRAINT `blog_memo_tag_relations_tagId_memoId_pk` PRIMARY KEY(`tagId`,`memoId`)
);
--> statement-breakpoint
CREATE TABLE `blog_memo_tag` (
	`id` varchar(255) NOT NULL,
	`tag_name` varchar(255) NOT NULL,
	`create_ts` datetime NOT NULL DEFAULT '2025-08-15 09:03:52.956',
	`updated_ts` datetime NOT NULL DEFAULT '2025-08-15 09:03:52.956',
	`user_id` varchar(255) NOT NULL,
	CONSTRAINT `blog_memo_tag_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_memo_tag_tag_name_unique` UNIQUE(`tag_name`)
);
--> statement-breakpoint
CREATE TABLE `blog_oauth` (
	`id` varchar(255) NOT NULL,
	`userId` varchar(255),
	`provider` varchar(255) NOT NULL,
	`providerId` varchar(255) NOT NULL,
	`providerUnionId` varchar(255),
	`providerToken` varchar(255),
	`providerRefreshToken` varchar(255),
	`createdAt` datetime NOT NULL DEFAULT '2025-08-15 09:03:52.955',
	`updatedAt` datetime NOT NULL DEFAULT '2025-08-15 09:03:52.955',
	CONSTRAINT `blog_oauth_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_oauth_provider_providerId_unique` UNIQUE(`provider`,`providerId`)
);
--> statement-breakpoint
CREATE TABLE `blog_user_config` (
	`id` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`allowEmailNotify` int DEFAULT 0,
	`createdAt` datetime NOT NULL DEFAULT '2025-08-15 09:03:52.955',
	`updatedAt` datetime NOT NULL DEFAULT '2025-08-15 09:03:52.955',
	CONSTRAINT `blog_user_config_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_user_config_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `blog_user` (
	`id` varchar(255) NOT NULL,
	`email` varchar(255),
	`phone` varchar(255),
	`username` varchar(255) NOT NULL,
	`nickname` varchar(255),
	`password` varchar(255) NOT NULL,
	`avatar_url` varchar(255),
	`website` varchar(255),
	`role` varchar(50) NOT NULL DEFAULT 'user',
	`status` int NOT NULL DEFAULT 1,
	CONSTRAINT `blog_user_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_user_username_unique` UNIQUE(`username`),
	CONSTRAINT `blog_user_nickname_unique` UNIQUE(`nickname`)
);
