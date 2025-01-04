import { upsertModule, getModuleById, removeModule } from '@repositories/modules'
import { ModuleData } from '@entities/Module'
import { NextRequest } from 'next/server'
import { prisma } from '@lib/prisma'
import { auth } from '@auth'

export async function PUT(req: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id as string
  if (!userId) {
    return new Response(null, { status: 401 })
  }

  try {
    const module = await req.json()
    await upsertModule(prisma, userId, module as ModuleData)
    return new Response(null, { status: 200 })

  } catch {
    return new Response(null, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  const userId = session?.user?.id as string
  if (!userId) {
    return new Response(null, { status: 401 })
  }

  try {
    const module = await req.json()
    await upsertModule(prisma, userId, module as ModuleData)
    return new Response(null, { status: 200 })

  } catch {
    return new Response(null, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ moduleId: string }> }) {
  const session = await auth()
  const userId = session?.user?.id as string

  if (!userId) {
    return new Response(null, { status: 401 })
  }

  const { moduleId } = await params

  const module = await getModuleById(prisma, userId, moduleId)

  if (!module) {
    return new Response(null, { status: 400 })
  }

  try {
    await removeModule(prisma, userId, moduleId)
    return new Response(null, { status: 200 })

  } catch {
    return new Response(null, { status: 500 })
  }
}
