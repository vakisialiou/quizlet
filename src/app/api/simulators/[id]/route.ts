import { createRelationSimulator } from '@repositories/relation-simulator'
import {createSimulator, updateSimulator} from '@repositories/simulators'
import {RelationSimulatorData} from '@entities/RelationSimulator'
import { getFolderById } from '@repositories/folders'
import { getModuleById } from '@repositories/modules'
import { SimulatorData } from '@entities/Simulator'
import { prisma, transaction } from '@lib/prisma'
import { auth } from '@auth'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const session = await auth()
  const userId = session?.user?.id as string

  const body = await req.json()
  const simulator = body.simulator as SimulatorData
  const relationSimulator = body.relationSimulator as RelationSimulatorData

  if (simulator.id !== id || relationSimulator.simulatorId !== id) {
    return new Response(null, { status: 400 })
  }

  if (relationSimulator.folderId) {
    const folder = await getFolderById(prisma, userId, relationSimulator.folderId)
    if (!folder) {
      return new Response(null, {status: 400})
    }
  }

  if (relationSimulator.moduleId) {
    const course = await getModuleById(prisma, userId, relationSimulator.moduleId)
    if (!course) {
      return new Response(null, {status: 400})
    }
  }

  try {
    await transaction(prisma, async (entry) => {
      await createSimulator(entry, userId, {
        id,
        termId: simulator.termId,
        active: simulator.active,
        status: simulator.status,
        tracker: simulator.tracker || {},
        settings: simulator.settings || {},
        termIds: Array.isArray(simulator.termIds) ? simulator.termIds : [],
        historyIds: Array.isArray(simulator.historyIds) ? body.historyIds : [],
        continueIds: Array.isArray(simulator.continueIds) ? simulator.continueIds : [],
        rememberIds: Array.isArray(simulator.rememberIds) ? simulator.rememberIds : []
      } as SimulatorData)

      await createRelationSimulator(entry, userId, relationSimulator)
    })

    return new Response(null, { status: 200 })

  } catch {
    return new Response(null, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const session = await auth()
  const userId = session?.user?.id as string

  const body = await req.json()
  const simulator = body.simulator as SimulatorData

  if (simulator.id !== id) {
    return new Response(null, { status: 400 })
  }

  try {
    await updateSimulator(prisma, userId, {
      id,
      termId: simulator.termId,
      active: simulator.active,
      status: simulator.status,
      tracker: simulator.tracker || {},
      settings: simulator.settings || {},
      termIds: Array.isArray(simulator.termIds) ? simulator.termIds : [],
      historyIds: Array.isArray(simulator.historyIds) ? body.historyIds : [],
      continueIds: Array.isArray(simulator.continueIds) ? simulator.continueIds : [],
      rememberIds: Array.isArray(simulator.rememberIds) ? simulator.rememberIds : []
    } as SimulatorData)

    return new Response(null, { status: 200 })

  } catch {
    return new Response(null, { status: 500 })
  }
}
