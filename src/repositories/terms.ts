import { ClientTermType } from '@entities/ClientTerm'
import { ServerTermType } from '@entities/ServerTerm'
import objectPath from 'object-path'
import { db, Rows } from '@lib/db'

export const findTermsByUserId = async (userId: number): Promise<ClientTermType[]> => {
  const res = await db.find(`
    SELECT t.uuid, f.uuid as folderUUID, t.sort, t.question, t.answer
      FROM terms as t
     INNER JOIN folders as f ON t.folderId = f.id
     WHERE t.userId = ? and t.userId = ?;
  `, [userId, userId])

  return res as ClientTermType[]
}

export const findTermsByFolderId = async (folderId: number): Promise<ClientTermType[]> => {
  const res = await db.find(`
    SELECT uuid, sort, question, answer
      FROM terms WHERE folderId = ?
  `, [folderId])

  return res as ClientTermType[]
}

export const upsertTerm = async (folder: ServerTermType): Promise<number | null> => {
  const res = await db.multiInsert('terms', [folder] as Rows, ['sort', 'question', 'answer', 'updatedAt'])
  return objectPath.get(res, [0, 'insertId'], null)
}

export const removeTerm = async (uuid: string): Promise<boolean> => {
  const res = await db.query('DELETE FROM terms WHERE uuid = ?', [uuid])
  return res[0]['affectedRows'] > 0
}
