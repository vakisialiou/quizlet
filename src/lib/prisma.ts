import {
  User,
  Term,
  Folder,
  Account,
  Session,
  Settings,
  Simulator,
  PrismaClient,
  VerificationToken
} from '@prisma/client'

export type {
  User,
  Term,
  Folder,
  Account,
  Session,
  Settings,
  Simulator,
  VerificationToken
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
