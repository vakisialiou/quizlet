import ClientTerm from '@entities/ClientTerm'
import { prisma, Term } from '@lib/prisma'

export const findTermsByUserId = async (userId: string): Promise<Term[]> => {
  const res = await prisma.term.findMany({
    where: { userId },
    select: {
      id: true,
      sort: true,
      question: true,
      answer: true,
      folderId: true,
    },
  })

  return res.map(term => {
    return new ClientTerm(term.folderId)
      .setId(term.id)
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
      id: true,
      sort: true,
      question: true,
      answer: true,
      folderId: true,
    },
  })

  return res.map(term => {
    return new ClientTerm(term.folderId)
      .setId(term.id)
      .setSort(term.sort)
      .setAnswer(term.answer)
      .setQuestion(term.question)
      .serialize()
  })
}

export const getTermById = async (userId: string, id: string): Promise<ClientTerm[]> => {
  const res = await prisma.term.findMany({
    where: { userId, id },
    select: {
      id: true,
      sort: true,
      question: true,
      answer: true,
      folderId: true,
    },
  })

  return res.map(term => {
    return new ClientTerm(term.folderId)
      .setId(term.id)
      .setSort(term.sort)
      .setAnswer(term.answer)
      .setQuestion(term.question)
      .serialize()
  })
}

export const upsertTerm = async (term: Term): Promise<string | null> => {
  const res = await prisma.term.upsert({
    where: { id: term.id },
    update: {
      sort: term.sort,
      answer: term.answer,
      question: term.question,
      updatedAt: term.updatedAt || new Date(),
    },
    create: {
      id: term.id,
      sort: term.sort,
      userId: term.userId as string,
      answer: term.answer,
      question: term.question,
      folderId: term.folderId as string,
      createdAt: term.createdAt || new Date(),
      updatedAt: term.updatedAt || new Date()
    },
  })

  return res.id
}

export const removeTerm = async (id: string): Promise<boolean> => {
  const res = await prisma.term.delete({ where: { id } })
  return !!res?.id
}
