import { ClientFolderType } from '@entities/ClientFolder'
import { ServerFolderType } from '@entities/ServerFolder'
import objectPath from 'object-path'
import { db, Rows } from '@lib/db'

export const findFoldersByUserId = async (userId: number): Promise<ClientFolderType[]> => {
  const res = await db.find(`
    SELECT uuid, name
      FROM folders
     WHERE userId = ?
  `, [userId])
  return res as ClientFolderType[]
}

export const getFolderByUUID = async (userId: number, uuid: string): Promise<ServerFolderType | null> => {
  const res = await db.find(`
    SELECT id, userId, uuid, name, createdAt, updatedAt
      FROM folders
     WHERE userId = ? AND uuid = ?
  `, [userId, uuid])
  return res ? res[0] as ServerFolderType : null
}

export const upsertFolder = async (folder: ServerFolderType): Promise<number | null> => {
  const res = await db.multiInsert('folders', [folder] as Rows, ['name', 'updatedAt'])
  return objectPath.get(res, [0, 'insertId'], null)
}

export const removeFolder = async (uuid: string): Promise<boolean> => {
  const res = await db.query('DELETE FROM folders WHERE uuid = ?', [uuid])
  return res[0]['affectedRows'] > 0
}
