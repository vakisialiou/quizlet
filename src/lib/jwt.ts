import jwt from 'jsonwebtoken'

export const decode = (str: string): any | null => {
  try {
    return str ? jwt.decode(str) : null
  } catch (e) {
    return null
  }
}
