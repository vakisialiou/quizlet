import { findFoldersByUserId } from '@repositories/folders'

export async function GET() {
  try {
    const folders = await findFoldersByUserId(1)
    return new Response(JSON.stringify({ folders }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(null, { status: 500 })
  }
}
