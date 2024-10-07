-- Create user_preferences table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'shopping_list_user_preferences') THEN
        CREATE TABLE "shopping_list_user_preferences" (
            "user_id" text PRIMARY KEY NOT NULL,
            "has_seen_guide" boolean NOT NULL DEFAULT false,
            "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
            "updatedAt" timestamp with time zone
        );
    END IF;
END $$;