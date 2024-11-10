import { findTermsByFolderId } from '@repositories/terms'
import { getFolderByUUID } from '@repositories/folders'
import { auth } from '@auth'

export async function GET(req: Request, { params }: { params: { uuid: string } }) {
  const session = await auth()
  try {
    const folder = await getFolderByUUID(session?.user?.id as string, params.uuid)
    if (!folder) {
      return new Response(null, { status: 400 })
    }

    const items = await findTermsByFolderId(folder.id as string)
    return new Response(JSON.stringify({ items }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(null, { status: 500 })
  }
}
