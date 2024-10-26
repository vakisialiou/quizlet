import { findFolders } from '@repositories/folders'

export async function GET() {
  try {
    const folders = await findFolders(1)

    return new Response(JSON.stringify({ folders }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
