CREATE TABLE IF NOT EXISTS "shopping_list_user_preferences" (
	"user_id" text PRIMARY KEY NOT NULL,
	"has_seen_guide" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "shopping_list_inventory_item" ALTER COLUMN "expiration_date" SET DATA TYPE date;--> statement-breakpoint
ALTER TABLE "shopping_list_inventory_item" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "shopping_list_shopping_list_item" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "shopping_list_inventory_item" DROP COLUMN IF EXISTS "test_column";