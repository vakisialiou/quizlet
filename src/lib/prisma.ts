import { PrismaClient, User, Term, Folder } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

export type { User, Term, Folder }

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
