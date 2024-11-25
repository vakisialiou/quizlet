import { upsertSimulator } from '@repositories/simulators'
import { getFolderById } from '@repositories/folders'
import { Simulator } from '@lib/prisma'
import { auth } from '@auth'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const session = await auth()
  const userId = session?.user?.id as string

  const body = await req.json()
  const folder = await getFolderById(userId, body.folderId)
  if (!folder) {
    return new Response(null, { status: 400 })
  }

  try {
    await upsertSimulator({
      id,
      userId,
      termId: body.termId,
      active: body.active,
      status: body.status,
      folderId: body.folderId,
      termIds: Array.isArray(body.termIds) ? body.termIds : [],
      historyIds: Array.isArray(body.historyIds) ? body.historyIds : [],
      continueIds: Array.isArray(body.continueIds) ? body.continueIds : [],
      rememberIds: Array.isArray(body.rememberIds) ? body.rememberIds : []
    } as Simulator)

    return new Response(null, { status: 200 })

  } catch {
    return new Response(null, { status: 500 })
  }
}
