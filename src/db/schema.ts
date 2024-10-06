import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const inventoryItems = sqliteTable('inventory_items', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  quantity: integer('quantity').notNull(),
  category: text('category').notNull(),
  unit: text('unit').notNull(),
  expirationDate: text('expiration_date').notNull(),
})

export const shoppingListItems = sqliteTable('shopping_list_items', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  quantity: integer('quantity').notNull(),
  category: text('category').notNull(),
  unit: text('unit').notNull(),
  checked: integer('checked', { mode: 'boolean' }).notNull(),
})
