import { removeFolder, upsertFolder } from '@repositories/folders'
import ClientFolder from '@entities/ClientFolder'
import { auth } from '@auth'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) {
    return new Response(null, { status: 401 })
  }

  try {
    const body = await req.json()

    await upsertFolder(session?.user?.id, {
      id: params.id,
      name: body.name,
    } as ClientFolder)

    return new Response(null, { status: 200 })

  } catch (error) {
    return new Response(null, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { uuid: string } }) {
  try {
    const isRemoved = await removeFolder(params.uuid)
    return new Response(null, { status: isRemoved ? 200 : 400 })

  } catch (error) {
    return new Response(null, { status: 500 })
  }
}
