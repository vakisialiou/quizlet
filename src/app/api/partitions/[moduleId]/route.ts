import RelationFolder, { RelationFolderData } from '@entities/RelationFolder'
import { createManyRelationFolders } from '@repositories/relation-folder'
import RelationTerm, { RelationTermData } from '@entities/RelationTerm'
import { createManyRelationTerms } from '@repositories/relation-term'
import { upsertFolderGroup } from '@repositories/folder-group'
import { findTermsByModuleId } from '@repositories/terms'
import { createManyFolder } from '@repositories/folders'
import { getModuleById } from '@repositories/modules'
import Folder, { FolderData } from '@entities/Folder'
import { filterDeletedTerms } from '@helper/terms'
import { prisma, transaction } from '@lib/prisma'
import FolderGroup from '@entities/FolderGroup'
import { shuffle, chunks } from '@lib/array'
import { NextRequest } from 'next/server'
import { dateFormat } from '@lib/date'
import { auth } from '@auth'

export async function POST(req: NextRequest, { params }: { params: Promise<{ moduleId: string }> }) {
  const session = await auth()
  const userId = session?.user?.id as string
  if (!userId) {
    return new Response(null, { status: 401 })
  }

  const body = await req.json()
  if (!body.partitionSize) {
    return new Response(null, { status: 400 })
  }

  const { moduleId } = await params

  const module = await getModuleById(prisma, userId, moduleId)
  if (!module) {
    return new Response(null, { status: 400 })
  }

  const terms = filterDeletedTerms(await findTermsByModuleId(prisma, moduleId))
  if (terms.length === 0) {
    return new Response(null, { status: 400 })
  }

  let i = 0
  const groupedArray = chunks(shuffle(terms), Number(body.partitionSize))

  const folderGroup = new FolderGroup()
    .setName(dateFormat(new Date()))
    .setModuleId(moduleId)
    .serialize()

  const data = {
    folders: [],
    relationTerms: [],
    relationFolders: [],
  } as {
    folders: FolderData[]
    relationTerms: RelationTermData[]
    relationFolders: RelationFolderData[]
  }

  for (const terms of groupedArray) {
    ++i
    const folder = new Folder()
      .setName(`${i}`)
      .setOrder(i)
      .serialize()

    data.folders.push(folder)

    const relationFolder = new RelationFolder()
      .setGroupId(folderGroup.id)
      .setFolderId(folder.id)
      .serialize()

    data.relationFolders.push(relationFolder)

    for (const term of terms) {
      const relationTerm = new RelationTerm()
        .setTermId(term.id)
        .setFolderId(folder.id)
        .serialize()

      data.relationTerms.push(relationTerm)
    }
  }

  try {

    await transaction(prisma, async (entry) => {
      await upsertFolderGroup(entry, userId, folderGroup)
      await createManyFolder(entry, userId, data.folders)
      await createManyRelationTerms(entry, userId, data.relationTerms)
      await createManyRelationFolders(entry, userId, data.relationFolders)
    })

    return new Response(JSON.stringify({
      module,
      folders: data.folders,
      relationTerms: data.relationTerms,
      relationFolders: data.relationFolders,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch {
    return new Response(null, { status: 500 })
  }
}
