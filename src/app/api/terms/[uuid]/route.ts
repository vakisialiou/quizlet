import { removeTerm, upsertTerm } from '@repositories/terms'
import { getFolderByUUID } from '@repositories/folders'
import ServerTerm from '@entities/ServerTerm'
import { auth } from '@auth'

export async function PUT(req: Request) {
  const session = await auth()
  try {
    const body = await req.json()
    const folder = await getFolderByUUID(session?.user?.id as string, body.folderUUID)
    if (!folder) {
      return new Response(null, { status: 400 })
    }

    const term = new ServerTerm()
      .setUserId(session?.user?.id as string)
      .setUUID(body.uuid)
      .setFolderId(folder.id)
      .setAnswer(body.answer)
      .setQuestion(body.question)

    await upsertTerm(term)
    return new Response(null, { status: 200 })

  } catch (error) {
    return new Response(null, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { uuid: string } }) {
  try {
    const isRemoved = await removeTerm(params.uuid)
    return new Response(null, { status: isRemoved ? 200 : 400 })

  } catch (error) {
    return new Response(null, { status: 500 })
  }
}
