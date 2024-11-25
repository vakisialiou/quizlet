import { findFoldersByUserId } from '@repositories/folders'
import { auth } from '@auth'

export async function GET() {
  const session = await auth()
  try {
    const items = session?.user?.id ? await findFoldersByUserId(session?.user?.id) : []
    return new Response(JSON.stringify({ items }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch {
    return new Response(null, { status: 500 })
  }
}
