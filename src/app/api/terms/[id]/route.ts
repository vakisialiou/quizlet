import { getFolderById } from '@repositories/folders'
import { ClientTermData } from '@entities/ClientTerm'
import { upsertTerm } from '@repositories/terms'
import { prisma } from '@lib/prisma'
import { auth } from '@auth'

export async function PUT(req: Request) {
  const session = await auth()
  const userId = session?.user?.id as string

  const body = await req.json()
  const folder = await getFolderById(prisma, userId, body.folderId)
  if (!folder) {
    return new Response(null, { status: 400 })
  }

  try {
    await upsertTerm(prisma, userId, body as ClientTermData)

    return new Response(null, { status: 200 })

  } catch {
    return new Response(null, { status: 500 })
  }
}
