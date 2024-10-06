import { NextResponse } from 'next/server'
import { db } from '@/db'
import { shoppingListItems } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  const items = await db.select().from(shoppingListItems)
  return NextResponse.json(items)
}

export async function POST(request: Request) {
  const body = await request.json()
  const newItem = await db.insert(shoppingListItems).values(body).returning()
  return NextResponse.json(newItem[0])
}

export async function PUT(request: Request) {
  const { id, checked } = await request.json()
  const itemId = parseInt(id, 10)

  console.log('Received PUT request with id:', itemId, 'and checked:', checked)

  if (isNaN(itemId)) {
    return NextResponse.json({ error: 'Invalid item ID' }, { status: 400 })
  }

  try {
    const updatedItem = await db
      .update(shoppingListItems)
      .set({ checked })
      .where(eq(shoppingListItems.id, itemId))
      .returning()

    console.log('Updated item:', updatedItem)

    if (updatedItem.length === 0) {
      console.log('No item found with id:', itemId)
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    return NextResponse.json(updatedItem[0])
  } catch (error) {
    console.error('Error updating shopping list item:', error)
    return NextResponse.json(
      { error: 'Failed to update shopping list item' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const body = await request.json()
  await db.delete(shoppingListItems).where(eq(shoppingListItems.id, body.id))
  return NextResponse.json({ success: true })
}
