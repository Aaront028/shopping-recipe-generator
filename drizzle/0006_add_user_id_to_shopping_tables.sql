-- Add user_id column to shopping_list_inventory_item table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'shopping_list_inventory_item' AND column_name = 'user_id') THEN
        ALTER TABLE shopping_list_inventory_item ADD COLUMN user_id TEXT;
    END IF;
END $$;

-- Add user_id column to shopping_list_shopping_list_item table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'shopping_list_shopping_list_item' AND column_name = 'user_id') THEN
        ALTER TABLE shopping_list_shopping_list_item ADD COLUMN user_id TEXT;
    END IF;
END $$;