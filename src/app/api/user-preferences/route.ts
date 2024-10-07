import { NextResponse } from 'next/server'
import { db } from '@/db'
import { userPreferences, shoppingListItems, inventoryItems } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const prefs = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .limit(1)

  const shoppingListCount = await db
    .select({ count: sql`count(*)` })
    .from(shoppingListItems)
    .where(eq(shoppingListItems.userId, userId))

  const inventoryCount = await db
    .select({ count: sql`count(*)` })
    .from(inventoryItems)
    .where(eq(inventoryItems.userId, userId))
  const hasExistingItems =
    ((shoppingListCount[0]?.count ?? 0) as number) > 0 ||
    ((inventoryCount[0]?.count ?? 0) as number) > 0

  return NextResponse.json({
    hasSeenGuide: prefs[0]?.hasSeenGuide ?? false,
    hasExistingItems,
  })
}

export async function POST(request: Request) {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { hasSeenGuide } = await request.json()
  const updatedPrefs = await db
    .insert(userPreferences)
    .values({ userId, hasSeenGuide })
    .onConflictDoUpdate({
      target: userPreferences.userId,
      set: { hasSeenGuide },
    })
    .returning()
  return NextResponse.json(updatedPrefs[0])
}
