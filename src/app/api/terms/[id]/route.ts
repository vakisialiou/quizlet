import { removeTerm, upsertTerm, getTermById } from '@repositories/terms'
import { getFolderById } from '@repositories/folders'
import { Term } from '@lib/prisma'
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
    await upsertTerm({
      id,
      userId,
      order: body.order,
      answer: body.answer,
      folderId: body.folderId,
      question: body.question,
      answerLang: body.answerLang,
      questionLang: body.questionLang,
      association: body.association,
      associationLang: body.associationLang,
    } as Term)

    return new Response(null, { status: 200 })

  } catch {
    return new Response(null, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  const userId = session?.user?.id as string

  const term = await getTermById(userId, id)
  if (!term) {
    return new Response(null, { status: 400 })
  }

  try {
    const isRemoved = await removeTerm(id)
    return new Response(null, { status: isRemoved ? 200 : 400 })

  } catch {
    return new Response(null, { status: 500 })
  }
}
