import { upsertSettingsSimulator } from '@repositories/settings'
import { prisma } from '@lib/prisma'
import { auth } from '@auth'

export async function PUT(req: Request) {
  const session = await auth()
  const userId = session?.user?.id as string

  if (!userId) {
    return new Response(null, { status: 400 })
  }

  const body = await req.json()

  try {
    await upsertSettingsSimulator(prisma, userId, {
      simulator: {
        id: body.id,
        method: body.method,
        inverted: body.inverted,
      }
    })

    return new Response(null, { status: 200 })

  } catch {
    return new Response(null, { status: 500 })
  }
}
