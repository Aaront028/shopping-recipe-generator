import { NextResponse } from 'next/server'
import { db } from '@/db'
import { inventoryItems } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  const items = await db.select().from(inventoryItems)
  return NextResponse.json(items)
}

export async function POST(request: Request) {
  const body = await request.json()
  const newItem = await db.insert(inventoryItems).values(body).returning()
  return NextResponse.json(newItem[0])
}

export async function PUT(request: Request) {
  const body = await request.json()
  const updatedItem = await db
    .update(inventoryItems)
    .set(body)
    .where(eq(inventoryItems.id, body.id))
    .returning()
  return NextResponse.json(updatedItem[0])
}

export async function DELETE(request: Request) {
  const body = await request.json()
  await db.delete(inventoryItems).where(eq(inventoryItems.id, body.id))
  return NextResponse.json({ success: true })
}
