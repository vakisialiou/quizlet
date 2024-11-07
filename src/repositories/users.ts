import {ServerUserType} from '@entities/ServerUser'
import objectPath from 'object-path'
import {db, Rows} from '@lib/db'

export const upsertUser = async (user: ServerUserType): Promise<number | null> => {
  const res = await db.multiInsert('users', [user] as Rows, [
    'name', 'email', 'givenName', 'familyName', 'picture', 'updatedAt'
  ])
  return objectPath.get(res, [0, 'insertId'], null)
}
