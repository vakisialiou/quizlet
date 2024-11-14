import ServerFolder from '@entities/ServerFolder'
import ClientFolder from '@entities/ClientFolder'
import ClientTerm from '@entities/ClientTerm'
import { prisma } from '@lib/prisma'

export const findFoldersByUserId = async (userId: string): Promise<ClientFolder[]> => {
  const res = await prisma.folder.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      terms: {
        select: {
          id: true,
          sort: true,
          question: true,
          answer: true,
        }
      }
    },
  })

  return res.map(folder => {
    return new ClientFolder()
      .setId(folder.id)
      .setName(folder.name)
      .setTerms(
        folder.terms.map(term => {
          return new ClientTerm(folder.id)
            .setQuestion(term.question)
            .setAnswer(term.answer)
            .setId(term.id)
            .setSort(term.sort)
        })
      )
      .serialize()
  })
}

export const getFolderById = async (userId: string, id: string): Promise<ServerFolder | null> => {
  const folder = await prisma.folder.findUnique({
    where: { userId, id },
    select: {
      id: true,
      name: true,
      terms: {
        select: {
          id: true,
          sort: true,
          question: true,
          answer: true,
        }
      }
    },
  })

  if (folder) {
    return new ClientFolder()
      .setId(folder.id)
      .setName(folder.name)
      .setTerms(
        folder.terms.map(term => {
          return new ClientTerm(folder.id)
            .setQuestion(term.question)
            .setAnswer(term.answer)
            .setId(term.id)
            .setSort(term.sort)
        })
      )
      .serialize()
  }

  return null
}

export const upsertFolder = async (userId: string, folder: ClientFolder): Promise<string | null> => {
  const res = await prisma.folder.upsert({
    where: { id: folder.id },
    update: {
      name: folder.name,
      updatedAt: new Date(),
    },
    create: {
      userId,
      id: folder.id,
      name: folder.name,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  })

  return res.id
}

export const removeFolder = async (id: string): Promise<boolean> => {
  const res = await prisma.folder.delete({ where: { id } })
  return !!res?.id
}
