import ClientSimulator, { SimulatorStatus } from '@entities/ClientSimulator'
import ClientFolder from '@entities/ClientFolder'
import ClientTerm from '@entities/ClientTerm'
import { prisma, Folder } from '@lib/prisma'

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
          answer: true,
          question: true,
          association: true,
        }
      },
      simulators: {
        select: {
          id: true,
          termId: true,
          active: true,
          status: true,
          folderId: true,
          termIds: true,
          historyIds: true,
          continueIds: true,
          rememberIds: true
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
            .setId(term.id)
            .setSort(term.sort)
            .setAnswer(term.answer)
            .setQuestion(term.question)
            .setAssociation(term.association)
        })
      )
      .setSimulators(
        folder.simulators.map(simulator => {
          const termIds = Array.isArray(simulator.termIds) ? simulator.termIds as string[] : []
          const historyIds = Array.isArray(simulator.historyIds) ? simulator.historyIds as string[] : []
          const continueIds = Array.isArray(simulator.continueIds) ? simulator.continueIds as string[] : []
          const rememberIds = Array.isArray(simulator.rememberIds) ? simulator.rememberIds as string[] : []

          return new ClientSimulator(simulator.folderId, simulator.status as SimulatorStatus)
            .setId(simulator.id)
            .setTermId(simulator.termId)
            .setActive(simulator.active)
            .setTermIds(termIds)
            .setHistoryIds(historyIds)
            .setContinueIds(continueIds)
            .setRememberIds(rememberIds)
        })
      )
      .serialize()
  })
}

export const getFolderById = async (userId: string, id: string): Promise<ClientFolder | null> => {
  const folder = await prisma.folder.findUnique({
    where: { userId, id },
    select: {
      id: true,
      name: true,
      terms: {
        select: {
          id: true,
          sort: true,
          answer: true,
          question: true,
          association: true,
        }
      },
      simulators: {
        select: {
          id: true,
          termId: true,
          active: true,
          status: true,
          folderId: true,
          termIds: true,
          historyIds: true,
          continueIds: true,
          rememberIds: true
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
            .setId(term.id)
            .setSort(term.sort)
            .setAnswer(term.answer)
            .setQuestion(term.question)
            .setAssociation(term.association)
        })
      )
      .setSimulators(
        folder.simulators.map(simulator => {
          const termIds = Array.isArray(simulator.termIds) ? simulator.termIds as string[] : []
          const historyIds = Array.isArray(simulator.historyIds) ? simulator.historyIds as string[] : []
          const continueIds = Array.isArray(simulator.continueIds) ? simulator.continueIds as string[] : []
          const rememberIds = Array.isArray(simulator.rememberIds) ? simulator.rememberIds as string[] : []

          return new ClientSimulator(simulator.folderId, simulator.status as SimulatorStatus)
            .setId(simulator.id)
            .setTermId(simulator.termId)
            .setActive(simulator.active)
            .setTermIds(termIds)
            .setHistoryIds(historyIds)
            .setContinueIds(continueIds)
            .setRememberIds(rememberIds)
        })
      )
      .serialize()
  }

  return null
}

export const upsertFolder = async (userId: string, folder: Folder): Promise<string | null> => {
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
