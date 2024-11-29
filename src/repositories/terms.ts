import ClientTerm, { ClientTermData } from '@entities/ClientTerm'
import { prisma, Term } from '@lib/prisma'

export const findTermsByUserId = async (userId: string): Promise<ClientTermData[]> => {
  const res = await prisma.term.findMany({
    where: { userId },
    select: {
      id: true,
      sort: true,
      folderId: true,
      answer: true,
      answerLang: true,
      question: true,
      questionLang: true,
      association: true,
      associationLang: true,
    },
  })

  return res.map(term => {
    return new ClientTerm(term.folderId)
      .setId(term.id)
      .setSort(term.sort)
      .setAnswer(term.answer)
      .setAnswerLang(term.answerLang)
      .setQuestion(term.question)
      .setQuestionLang(term.questionLang)
      .setAssociation(term.association)
      .setAssociationLang(term.associationLang)
      .serialize()
  })
}

export const findTermsByFolderId = async (userId: string, folderId: string): Promise<ClientTermData[]> => {
  const res = await prisma.term.findMany({
    where: { userId, folderId },
    select: {
      id: true,
      sort: true,
      answer: true,
      answerLang: true,
      question: true,
      questionLang: true,
      association: true,
      associationLang: true,
      folderId: true,
    },
  })

  return res.map(term => {
    return new ClientTerm(term.folderId)
      .setId(term.id)
      .setSort(term.sort)
      .setAnswer(term.answer)
      .setAnswerLang(term.answerLang)
      .setQuestion(term.question)
      .setQuestionLang(term.questionLang)
      .setAssociation(term.association)
      .setAssociationLang(term.associationLang)
      .serialize()
  })
}

export const getTermById = async (userId: string, id: string): Promise<ClientTermData[]> => {
  const res = await prisma.term.findMany({
    where: { userId, id },
    select: {
      id: true,
      sort: true,
      answer: true,
      answerLang: true,
      question: true,
      questionLang: true,
      association: true,
      associationLang: true,
      folderId: true,
    },
  })

  return res.map(term => {
    return new ClientTerm(term.folderId)
      .setId(term.id)
      .setSort(term.sort)
      .setAnswer(term.answer)
      .setAnswerLang(term.answerLang)
      .setQuestion(term.question)
      .setQuestionLang(term.questionLang)
      .setAssociation(term.association)
      .setAssociationLang(term.associationLang)
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
      answerLang: term.answerLang,
      questionLang: term.questionLang,
      association: term.association,
      associationLang: term.associationLang,
      updatedAt: term.updatedAt || new Date(),
    },
    create: {
      id: term.id,
      sort: term.sort,
      userId: term.userId as string,
      answer: term.answer,
      answerLang: term.answerLang,
      question: term.question,
      questionLang: term.questionLang,
      association: term.association,
      associationLang: term.associationLang,
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
