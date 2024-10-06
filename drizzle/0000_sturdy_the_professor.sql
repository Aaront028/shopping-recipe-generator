CREATE TABLE `inventory_items` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`quantity` integer NOT NULL,
	`category` text NOT NULL,
	`unit` text NOT NULL,
	`expiration_date` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `shopping_list_items` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`quantity` integer NOT NULL,
	`category` text NOT NULL,
	`unit` text NOT NULL,
	`checked` integer NOT NULL
);
