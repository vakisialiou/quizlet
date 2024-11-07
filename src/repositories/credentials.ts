import { ServerCredentialType } from '@entities/ServerCredential'
import objectPath from 'object-path'
import { db, Rows } from '@lib/db'

export const upsertCredential = async (credential: ServerCredentialType): Promise<number | null> => {
  const res = await db.multiInsert('credentials', [credential] as Rows, [
    'accountId', 'accessToken', 'refreshToken', 'updatedAt'
  ])
  return objectPath.get(res, [0, 'insertId'], null)
}
