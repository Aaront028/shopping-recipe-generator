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
  if (body.expirationDate) {
    body.expirationDate = new Date(body.expirationDate)
      .toISOString()
      .split('T')[0]
  }
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
  const { id, ...updateData } = await request.json()

  console.log('Received update data:', JSON.stringify(updateData, null, 2))

  // Only update specific fields
  const allowedFields = [
    'name',
    'quantity',
    'category',
    'unit',
    'expirationDate',
  ]
  const cleanUpdateData = Object.fromEntries(
    Object.entries(updateData).filter(([key]) => allowedFields.includes(key))
  )

  console.log('Clean update data:', JSON.stringify(cleanUpdateData, null, 2))

  try {
    const updatedItem = await db
      .update(inventoryItems)
      .set(cleanUpdateData)
      .where(and(eq(inventoryItems.id, id), eq(inventoryItems.userId, userId)))
      .returning()
    if (updatedItem.length === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }
    console.log('Updated item:', JSON.stringify(updatedItem[0], null, 2))
    return NextResponse.json(updatedItem[0])
  } catch (error) {
    console.error('Error updating inventory item:', error)
    return NextResponse.json(
      {
        error: 'Failed to update item',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
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
