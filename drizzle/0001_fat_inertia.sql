CREATE TABLE IF NOT EXISTS "shopping_list_inventory_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"quantity" integer NOT NULL,
	"category" text NOT NULL,
	"unit" text NOT NULL,
	"expiration_date" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shopping_list_shopping_list_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"quantity" integer NOT NULL,
	"category" text NOT NULL,
	"unit" text NOT NULL,
	"checked" boolean NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
DROP TABLE "inventory_items";--> statement-breakpoint
DROP TABLE "shopping_list_items";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "inventory_name_idx" ON "shopping_list_inventory_item" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "shopping_list_name_idx" ON "shopping_list_shopping_list_item" USING btree ("name");