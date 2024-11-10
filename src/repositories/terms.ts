import ServerTerm from '@entities/ServerTerm'
import ClientTerm from '@entities/ClientTerm'
import { prisma } from '@lib/prisma'

export const findTermsByUserId = async (userId: string): Promise<ClientTerm[]> => {
  const res = await prisma.term.findMany({
    where: { userId },
    select: {
      uuid: true,
      sort: true,
      question: true,
      answer: true,
      folder: {
        select: { uuid: true },
      },
    },
  })

  return res.map(term => {
    return new ClientTerm(term.folder?.uuid || '')
      .setUUID(term.uuid)
      .setSort(term.sort)
      .setAnswer(term.answer)
      .setQuestion(term.question)
      .serialize()
  })
}

export const findTermsByFolderId = async (folderId: string): Promise<ClientTerm[]> => {
  const res = await prisma.term.findMany({
    where: { folderId },
    select: {
      uuid: true,
      sort: true,
      question: true,
      answer: true,
      folder: {
        select: { uuid: true },
      },
    },
  })

  return res.map(term => {
    return new ClientTerm()
      .setUUID(term.uuid)
      .setSort(term.sort)
      .setAnswer(term.answer)
      .setQuestion(term.question)
      .setFolderUUID(term.folder?.uuid)
  })
}

export const upsertTerm = async (term: ServerTerm): Promise<string | null> => {
  const res = await prisma.term.upsert({
    where: { uuid: term.uuid },
    update: {
      sort: term.sort,
      answer: term.answer,
      question: term.question,
      updatedAt: term.updatedAt,
    },
    create: {
      uuid: term.uuid,
      sort: term.sort,
      userId: term.userId as string,
      answer: term.answer,
      question: term.question,
      folderId: term.folderId as string,
      createdAt: term.createdAt,
      updatedAt: term.updatedAt
    },
  })

  return res.id
}

export const removeTerm = async (uuid: string): Promise<boolean> => {
  const res = await prisma.term.delete({ where: { uuid } })
  return !!res?.id
}
