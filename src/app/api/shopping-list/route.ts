import { NextResponse } from 'next/server'
import { db } from '@/db'
import { shoppingListItems } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const items = await db
    .select()
    .from(shoppingListItems)
    .where(eq(shoppingListItems.userId, userId))
  return NextResponse.json(items)
}

export async function POST(request: Request) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  try {
    const newItem = await db
      .insert(shoppingListItems)
      .values({ ...body, userId })
      .returning()
    return NextResponse.json(newItem[0])
  } catch (error) {
    console.error('Error inserting item:', error)
    return NextResponse.json({ error: 'Failed to add item' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id, ...updateData } = await request.json()
  const updatedItem = await db
    .update(shoppingListItems)
    .set(updateData)
    .where(
      and(eq(shoppingListItems.id, id), eq(shoppingListItems.userId, userId))
    )
    .returning()
  if (updatedItem.length === 0) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 })
  }
  return NextResponse.json(updatedItem[0])
}

export async function DELETE(request: Request) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await request.json()
  await db
    .delete(shoppingListItems)
    .where(
      and(eq(shoppingListItems.id, id), eq(shoppingListItems.userId, userId))
    )
  return NextResponse.json({ success: true })
}
