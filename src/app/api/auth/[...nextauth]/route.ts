import GoogleProvider from 'next-auth/providers/google'
import NextAuth from 'next-auth'
import { config } from '@config'

export const authOptions = {
  secret: config.oauth.secret,
  providers: [
    GoogleProvider(config.oauth.providers.google),
  ],
}

export default NextAuth(authOptions)
