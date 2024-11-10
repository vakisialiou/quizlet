import { findFoldersByUserId } from '@repositories/folders'
import { auth } from '@auth'

export async function GET() {
  const session = await auth()
  try {
    const folders = await findFoldersByUserId(session?.user?.id as string)
    return new Response(JSON.stringify({ folders }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(null, { status: 500 })
  }
}
