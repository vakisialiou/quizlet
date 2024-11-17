import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@lib/prisma'
import NextAuth from 'next-auth'
import { config } from '@config'

export const { auth, handlers } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: config.oauth.secret,
  providers: [
    GoogleProvider(config.oauth.providers.google),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account) {
        token.userId = user.id
        token.sub = account.providerAccountId
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.userId as string
      return session
    }
  },
  debug: false,
})

