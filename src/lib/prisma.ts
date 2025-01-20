import {
  User,
  Term,
  Folder,
  Account,
  Session,
  Settings,
  Simulator,
  PrismaClient,
  FolderGroup,
  RelationTerm,
  VerificationToken,
  Prisma
} from '@prisma/client'

export type {
  User,
  Term,
  Folder,
  Account,
  Session,
  Settings,
  Simulator,
  FolderGroup,
  RelationTerm,
  VerificationToken,
  Prisma
}

export type PrismaEntry = PrismaClient | Prisma.TransactionClient

export const transaction = <T>(prisma: PrismaClient, callback: (entry: Prisma.TransactionClient) => Promise<T>): Promise<T> => {
  return prisma.$transaction(callback)
}


const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
