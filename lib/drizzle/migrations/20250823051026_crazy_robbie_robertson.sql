ALTER TABLE `blog_memos` MODIFY COLUMN `from` varchar(255) DEFAULT 'blog';--> statement-breakpoint
ALTER TABLE `blog_memos` MODIFY COLUMN `courier` varchar(255) DEFAULT '阿康zz';--> statement-breakpoint
ALTER TABLE `blog_memos` ADD `type` varchar(255) DEFAULT 'memo';