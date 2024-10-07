CREATE TABLE IF NOT EXISTS "shopping_list_user_preferences" (
  "user_id" text PRIMARY KEY NOT NULL,
  "has_seen_guide" boolean NOT NULL DEFAULT false,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updatedAt" timestamp with time zone
);