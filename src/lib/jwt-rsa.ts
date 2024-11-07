import { config } from '@config'
// import jwksClient from 'jwks-rsa'
import jwt from 'jsonwebtoken'

// const client = jwksClient({
//   cache: true, // Default Value
//   cacheMaxEntries: 5, // Default value
//   cacheMaxAge: 600000, // Defaults to 10m
//   jwksUri: 'https://www.googleapis.com/oauth2/v3/certs'
// })
//
// function getSigningKey(header, callback) {
//   client.getSigningKey(header.kid, (err, key) => {
//     console.log(err, key)
//     const signingKey = key ? key.getPublicKey() : null
//     callback(null, signingKey)
//   })
// }

/**
 *
 * @param {string} str
 * @returns {Promise.<Object|null>}
 */
export const googleTokenIdVerify = async (str: string | null) => {
  if (!str) {
    return null
  }

  const options = {
    // audience: config.oauth.clientId,
    issuer: ['accounts.google.com', 'https://accounts.google.com']
  }
  // console.log(options)
  return new Promise((resolve) => {
    jwt.verify(str, '', options, (err, decoded) => {
      resolve(err ? null : decoded)
    })
  })
}
