import { sql } from 'drizzle-orm'
import {
  index,
  pgTableCreator,
  serial,
  text,
  integer,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core'

export const createTable = pgTableCreator((name) => `shopping_list_${name}`)

export const inventoryItems = createTable(
  'inventory_item',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    quantity: integer('quantity').notNull(),
    category: text('category').notNull(),
    unit: text('unit').notNull(),
    expirationDate: text('expiration_date').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }),
  },
  (table) => ({
    nameIndex: index('inventory_name_idx').on(table.name),
  })
)

export const shoppingListItems = createTable(
  'shopping_list_item',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    quantity: integer('quantity').notNull(),
    category: text('category').notNull(),
    unit: text('unit').notNull(),
    checked: boolean('checked').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }),
  },
  (table) => ({
    nameIndex: index('shopping_list_name_idx').on(table.name),
  })
)
