import { pgTable, serial, text, integer, boolean } from 'drizzle-orm/pg-core'

export const inventoryItems = pgTable('inventory_items', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  quantity: integer('quantity').notNull(),
  category: text('category').notNull(),
  unit: text('unit').notNull(),
  expirationDate: text('expiration_date').notNull(),
})

export const shoppingListItems = pgTable('shopping_list_items', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  quantity: integer('quantity').notNull(),
  category: text('category').notNull(),
  unit: text('unit').notNull(),
  checked: boolean('checked').notNull(),
})
