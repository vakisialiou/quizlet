import { ClientFolderType } from '@entities/ClientFolder'
import { ServerFolderType } from '@entities/ServerFolder'
import objectPath from 'object-path'
import { db, Rows } from '@lib/db'

export const findFolders = async (userId: number): Promise<ClientFolderType[]> => {
  const res = await db.find(
    `
    SELECT f.uuid, f.name, COUNT(t.id) as count
      FROM quizlet.folders as f
      LEFT JOIN quizlet.terms as t ON t.folderId = f.id
     WHERE f.userId = ?
     GROUP BY f.id
    `,
    [userId]
  )
  return res as ClientFolderType[]
}

export const upsertFolder = async (folder: ServerFolderType): Promise<number | null> => {
  const res = await db.multiInsert('folders', [folder] as Rows, ['name', 'updatedAt'])
  return objectPath.get(res, [0, 'insertId'], null)
}

export const removeFolder = async (uuid: string): Promise<boolean> => {
  const res = await db.query('DELETE FROM folders WHERE uuid = ?', [uuid])
  return res[0]['affectedRows'] > 0
}
