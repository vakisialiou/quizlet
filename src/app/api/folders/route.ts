import { findFoldersByUserId, createManyFolder } from '@repositories/folders'
import { createManyRelationFolders } from '@repositories/relation-folder'
import { createManyRelationTerms } from '@repositories/relation-term'
import { prisma, transaction } from '@lib/prisma'
import { MultiFolders } from '@helper/folders'
import { NextRequest } from 'next/server'
import { auth } from '@auth'

export async function GET() {
  const session = await auth()
  const userId = session?.user?.id as string

  if (!userId) {
    return new Response(null, { status: 401 })
  }

  const items = await findFoldersByUserId(prisma, userId)
  return new Response(JSON.stringify({ items }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id as string

  if (!userId) {
    return new Response(null, { status: 401 })
  }

  const data = await req.json() as MultiFolders

  await transaction(prisma, async (entry) => {
    await createManyFolder(entry, userId, data.folders)
    await createManyRelationTerms(entry, userId, data.relationTerms)
    await createManyRelationFolders(entry, userId, data.relationFolders)
  })

  return new Response(null, { status: 200 })
}
