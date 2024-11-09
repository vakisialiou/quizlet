import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from '@lib/prisma'
import NextAuth from 'next-auth'
import { config } from '@config'

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: config.oauth.secret,
  providers: [
    GoogleProvider(config.oauth.providers.google),
  ]
})

