-- Check if user_id column exists in shopping_list_inventory_item
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='shopping_list_inventory_item' AND column_name='user_id') THEN
        -- Add user_id column as nullable
        ALTER TABLE "shopping_list_inventory_item" ADD COLUMN "user_id" text;
    END IF;
END $$;

-- Update existing rows with a default user_id
UPDATE "shopping_list_inventory_item" SET "user_id" = 'default_user' WHERE "user_id" IS NULL;

-- Make user_id non-nullable only after updating existing rows
ALTER TABLE "shopping_list_inventory_item" ALTER COLUMN "user_id" SET NOT NULL;

-- Add index on user_id if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes
                   WHERE tablename = 'shopping_list_inventory_item' AND indexname = 'inventory_user_id_idx') THEN
        CREATE INDEX "inventory_user_id_idx" ON "shopping_list_inventory_item" ("user_id");
    END IF;
END $$;

-- Repeat the same for shopping_list_item table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='shopping_list_shopping_list_item' AND column_name='user_id') THEN
        ALTER TABLE "shopping_list_shopping_list_item" ADD COLUMN "user_id" text;
    END IF;
END $$;

-- Update existing rows with a default user_id
UPDATE "shopping_list_shopping_list_item" SET "user_id" = 'default_user' WHERE "user_id" IS NULL;

-- Make user_id non-nullable only after updating existing rows
ALTER TABLE "shopping_list_shopping_list_item" ALTER COLUMN "user_id" SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes
                   WHERE tablename = 'shopping_list_shopping_list_item' AND indexname = 'shopping_list_user_id_idx') THEN
        CREATE INDEX "shopping_list_user_id_idx" ON "shopping_list_shopping_list_item" ("user_id");
    END IF;
END $$;