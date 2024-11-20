import { removeFolder, upsertFolder, getFolderById } from '@repositories/folders'
import { Folder } from '@lib/prisma'
import { auth } from '@auth'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const userId = session?.user?.id as string

  if (!userId) {
    return new Response(null, { status: 401 })
  }

  const { id } = await params

  try {
    const folder = await getFolderById(userId, id)
    return new Response(JSON.stringify({ folder }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch {
    return new Response(null, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const userId = session?.user?.id as string

  if (!userId) {
    return new Response(null, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await req.json()

    await upsertFolder(userId, { id, name: body.name } as Folder)

    return new Response(null, { status: 200 })

  } catch {
    return new Response(null, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  const userId = session?.user?.id as string

  if (!userId) {
    return new Response(null, { status: 401 })
  }

  const folder = await getFolderById(userId, id)
  if (!folder) {
    return new Response(null, { status: 400 })
  }

  try {
    const isRemoved = await removeFolder(id)
    return new Response(null, { status: isRemoved ? 200 : 400 })

  } catch {
    return new Response(null, { status: 500 })
  }
}
