import { upsertSettingsSimulator } from '@repositories/settings'
import { SettingsData } from '@entities/Settings'
import { prisma } from '@lib/prisma'
import { auth } from '@auth'

export async function PUT(req: Request) {
  const session = await auth()
  const userId = session?.user?.id as string

  if (!userId) {
    return new Response(null, { status: 400 })
  }

  const body = await req.json() as SettingsData
  await upsertSettingsSimulator(prisma, userId, body)

  return new Response(null, { status: 200 })
}
