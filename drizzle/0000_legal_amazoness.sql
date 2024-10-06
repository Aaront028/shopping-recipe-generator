CREATE TABLE IF NOT EXISTS "inventory_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"quantity" integer NOT NULL,
	"category" text NOT NULL,
	"unit" text NOT NULL,
	"expiration_date" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shopping_list_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"quantity" integer NOT NULL,
	"category" text NOT NULL,
	"unit" text NOT NULL,
	"checked" boolean NOT NULL
);
