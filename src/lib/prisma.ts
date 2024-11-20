import { PrismaClient, User, Term, Folder, Account, Session, VerificationToken, Simulator } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

export type { User, Term, Folder, Account, Session, Simulator, VerificationToken }

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
