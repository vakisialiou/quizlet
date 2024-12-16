import { findFoldersByUserId } from '@repositories/folders'
import { prisma } from '@lib/prisma'
import { auth } from '@auth'

export async function GET() {
  const session = await auth()
  const userId = session?.user?.id as string

  if (!userId) {
    return new Response(null, { status: 401 })
  }

  try {
    const items = await findFoldersByUserId(prisma, userId)
    return new Response(JSON.stringify({ items }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch {
    return new Response(null, { status: 500 })
  }
}
