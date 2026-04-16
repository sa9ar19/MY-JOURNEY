CREATE TABLE `blog_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` longtext NOT NULL,
	`excerpt` text,
	`featuredImageUrl` varchar(1024),
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `blog_posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `destinations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`coverImageUrl` varchar(1024),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `destinations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gallery_photos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`destinationId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`imageUrl` varchar(1024) NOT NULL,
	`order` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `gallery_photos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `social_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`platform` varchar(50) NOT NULL,
	`url` varchar(1024) NOT NULL,
	`icon` varchar(50),
	`order` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `social_links_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP TABLE `contact_submissions`;