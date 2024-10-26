import { upsertFolder } from '@repositories/folders'
import { Folder } from '@entities/EntityFolder'

export async function PUT(req: Request) {
  try {

    const body = await req.json()

    const folder = new Folder()
    folder
      .setId(body.id)
      .setUUID(body.uuid)
      .setName(body.name)
      .setUserId(1)
      .setCreatedAt(body.createdAt)
      .setUpdatedAt(body.updatedAt)

    await upsertFolder(folder)

    return new Response(JSON.stringify({ folders: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
