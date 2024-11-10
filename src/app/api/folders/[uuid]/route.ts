import { removeFolder, upsertFolder } from '@repositories/folders'
import ServerFolder from '@entities/ServerFolder'
import { auth } from '@auth'

export async function PUT(req: Request) {
  const session = await auth()
  try {
    const body = await req.json()
    const folder = new ServerFolder()
    folder
      .setUserId(session?.user?.id as string)
      .setUUID(body.uuid)
      .setName(body.name)

    await upsertFolder(folder)
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
