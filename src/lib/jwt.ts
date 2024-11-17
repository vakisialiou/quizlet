import jwt from 'jsonwebtoken'

export const decode = (str: string): jwt.JwtPayload | string | null => {
  try {
    return str ? jwt.decode(str) : null
  } catch {
    return null
  }
}
