import ClientRelationFolder, { ClientRelationFolderData } from '@entities/ClientRelationFolder'
import ClientRelationTerm, { ClientRelationTermData } from '@entities/ClientRelationTerm'
import { createManyRelationFolders } from '@repositories/relation-folder'
import ClientFolder, { ClientFolderData } from '@entities/ClientFolder'
import { createManyFolder, getFolderById } from '@repositories/folders'
import { createManyRelationTerms } from '@repositories/relation-term'
import { upsertFolderGroup } from '@repositories/folder-group'
import ClientFolderGroup from '@entities/ClientFolderGroup'
import { filterDeletedTerms } from '@helper/terms'
import { prisma, transaction } from '@lib/prisma'
import { shuffle, chunks } from '@lib/array'
import { NextRequest } from 'next/server'
import { dateFormat } from '@lib/date'
import { auth } from '@auth'

export async function POST(req: NextRequest, { params }: { params: Promise<{ folderId: string }> }) {
  const session = await auth()
  const userId = session?.user?.id as string
  if (!userId) {
    return new Response(null, { status: 401 })
  }

  const body = await req.json()
  if (!body.partitionSize) {
    return new Response(null, { status: 400 })
  }

  const { folderId } = await params

  const folderGroup = new ClientFolderGroup()
    .setFolderId(folderId)
    .setName(dateFormat(new Date()))

  const data = {
    folders: [],
    relationTerms: [],
    relationFolders: [],
  } as {
    folders: ClientFolderData[]
    relationTerms: ClientRelationTermData[]
    relationFolders: ClientRelationFolderData[]
  }

  const parentFolder = await getFolderById(prisma, userId, folderId)
  if (!parentFolder) {
    return new Response(null, { status: 400 })
  }

  const terms = filterDeletedTerms(parentFolder.terms)
  if (terms.length === 0) {
    return new Response(null, { status: 400 })
  }

  let i = 0
  const groupedArray = chunks(shuffle(terms), Number(body.partitionSize))

  for (const terms of groupedArray) {
    ++i
    const folder = new ClientFolder()
      .setParentId(folderId)
      .setIsModule(false)
      .setName(`${i}`)
      .setOrder(i)

    const relationFolder = new ClientRelationFolder()
      .setFolderGroupId(folderGroup.id)
      .setFolderId(folder.id)

    folderGroup.relationFolders.push(relationFolder)
    data.relationFolders.push(relationFolder.serialize())

    for (const term of terms) {
      const relationTerm = new ClientRelationTerm()
        .setTermId(term.id)
        .setFolderId(folder.id)

      folder.relationTerms.push(relationTerm)
      data.relationTerms.push(relationTerm.serialize())
    }

    data.folders.push(folder.serialize())
  }

  try {

    const folderGroupData = folderGroup.serialize()
    parentFolder.folderGroups.push(folderGroupData)

    await transaction(prisma, async (entry) => {
      await upsertFolderGroup(entry, folderGroupData)
      await createManyFolder(entry, userId, data.folders)
      await createManyRelationFolders(entry, data.relationFolders)
      await createManyRelationTerms(entry, data.relationTerms)
    })

    return new Response(JSON.stringify([ parentFolder, ...data.folders ]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch {
    return new Response(null, { status: 500 })
  }
}
