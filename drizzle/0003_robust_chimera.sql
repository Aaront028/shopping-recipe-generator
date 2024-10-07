ALTER TABLE "shopping_list_shopping_list_item" ALTER COLUMN "checked" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "shopping_list_shopping_list_item" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "shopping_list_shopping_list_item" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "shopping_list_inventory_item" ADD COLUMN "user_id" text NOT NULL;