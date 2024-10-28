import { findTermsByFolderId } from '@repositories/terms'
import { getFolderByUUID } from '@repositories/folders'

export async function GET(req: Request, { params }: { params: { uuid: string } }) {
  try {
    const folder = await getFolderByUUID(1, params.uuid)
    if (!folder) {
      return new Response(null, { status: 400 })
    }

    console.log(params.uuid, folder, '====')
    const items = await findTermsByFolderId(folder.id as number)
    return new Response(JSON.stringify({ items }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.log(error, '========')
    return new Response(null, { status: 500 })
  }
}
