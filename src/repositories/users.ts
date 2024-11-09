import { prisma, User } from '@lib/prisma'

export const upsertUser = async (user: Omit<User, 'id'>): Promise<number | null> => {
  const res = await prisma.user.upsert({
    where: { email: user.email },
    update: {
      name: user.name,
      username: user.username,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      updatedAt: user.updatedAt,
    },
    create: {
      name: user.name,
      username: user.username,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    },
  })

  return res.id
}
