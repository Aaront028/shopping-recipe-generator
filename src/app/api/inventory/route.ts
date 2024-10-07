import { NextResponse } from 'next/server'
import { db } from '@/db'
import { inventoryItems } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const items = await db
    .select()
    .from(inventoryItems)
    .where(eq(inventoryItems.userId, userId))
  return NextResponse.json(items)
}

export async function POST(request: Request) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json()
  const newItem = await db
    .insert(inventoryItems)
    .values({ ...body, userId })
    .returning()
  return NextResponse.json(newItem[0])
}

export async function PUT(request: Request) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id, quantity: newQuantity, ...otherUpdateData } = await request.json()

  // First, get the current item
  const currentItem = await db
    .select()
    .from(inventoryItems)
    .where(and(eq(inventoryItems.id, id), eq(inventoryItems.userId, userId)))
    .limit(1)

  if (currentItem.length === 0) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 })
  }

  // If a new quantity is provided, use it directly (don't add to current quantity)
  const updateData = {
    ...otherUpdateData,
    ...(newQuantity !== undefined ? { quantity: newQuantity } : {}),
  }

  const updatedItem = await db
    .update(inventoryItems)
    .set(updateData)
    .where(and(eq(inventoryItems.id, id), eq(inventoryItems.userId, userId)))
    .returning()

  return NextResponse.json(updatedItem[0])
}

export async function DELETE(request: Request) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await request.json()
  await db
    .delete(inventoryItems)
    .where(and(eq(inventoryItems.id, id), eq(inventoryItems.userId, userId)))
  return NextResponse.json({ success: true })
}
