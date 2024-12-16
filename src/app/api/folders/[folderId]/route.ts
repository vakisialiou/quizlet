import { removeFolders, upsertFolder, getFolderById } from '@repositories/folders'
import { removeFolderGroups } from '@repositories/folder-group'
import { ClientFolderData } from '@entities/ClientFolder'
import { prisma, transaction } from '@lib/prisma'
import { NextRequest } from 'next/server'
import { auth } from '@auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ folderId: string }> }) {
  const session = await auth()
  const userId = session?.user?.id as string

  if (!userId) {
    return new Response(null, { status: 401 })
  }

  const { folderId } = await params

  try {
    const folder = await getFolderById(prisma, userId, folderId)
    const parentFolder = folder?.parentId ? await getFolderById(prisma, userId, folder?.parentId) : null

    return new Response(JSON.stringify({ folder, parentFolder }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch {
    return new Response(null, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id as string

  if (!userId) {
    return new Response(null, { status: 401 })
  }

  try {
    const folder = await req.json()

    await upsertFolder(prisma, userId, folder as ClientFolderData)

    return new Response(null, { status: 200 })

  } catch {
    return new Response(null, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ folderId: string }> }) {
  const session = await auth()
  const userId = session?.user?.id as string

  if (!userId) {
    return new Response(null, { status: 401 })
  }

  const { folderId } = await params

  const folder = await getFolderById(prisma, userId, folderId)

  if (!folder) {
    return new Response(null, { status: 401 })
  }

  const parentFolder = folder.parentId ? await getFolderById(prisma, userId, folder.parentId) : null

  try {
    let refreshFolderId = null
    const removeFolderIds = [] as string[]
    const removeFolderGroupIds = [] as string[]

    await transaction(prisma, async (entry) => {
      if (parentFolder) {
        // Удаление дочернего элемента и обновление родительского.
        refreshFolderId = parentFolder.id

        for (const folderGroup of parentFolder.folderGroups) {
          for (const relationFolder of folderGroup.relationFolders) {
            if (relationFolder.folderId === folderId && folderGroup.relationFolders.length === 1) {
              // Удаление группы т.к., в ней не осталось ни одного элемента.
              removeFolderGroupIds.push(relationFolder.folderGroupId)
            }
          }
        }
      } else {
        // Удаление родительского элемента и его зависимостей.
        for (const folderGroup of folder.folderGroups) {
          for (const relationFolder of folderGroup.relationFolders) {
            removeFolderIds.push(relationFolder.folderId)
            removeFolderGroupIds.push(relationFolder.folderGroupId)
          }
        }
      }

      removeFolderIds.push(folder.id)

      if (removeFolderGroupIds.length > 0) {
        await removeFolderGroups(entry, removeFolderGroupIds)
      }
      await removeFolders(entry, userId, removeFolderIds)
    })

    return new Response(JSON.stringify({
      removeFolderIds,
      removeFolderGroupIds,
      refreshFolder: refreshFolderId ? await getFolderById(prisma, userId, refreshFolderId) : null
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch {
    return new Response(null, { status: 500 })
  }
}
