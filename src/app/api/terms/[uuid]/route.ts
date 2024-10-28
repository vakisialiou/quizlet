import { removeTerm, upsertTerm } from '@repositories/terms'
import { getFolderByUUID } from '@repositories/folders'
import ServerTerm, { ServerTermType } from '@entities/ServerTerm'

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const folder = await getFolderByUUID(1, body.folderUUID)
    if (!folder) {
      return new Response(null, { status: 400 })
    }

    const term = new ServerTerm()
      .setUserId(1)
      .setUUID(body.uuid)
      .setFolderId(folder.id)
      .setAnswer(body.answer)
      .setQuestion(body.question)

    await upsertTerm(term as ServerTermType)
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
