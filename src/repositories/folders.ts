import { FolderType, EntityFolderType } from '@entities/EntityFolder'
import { db, Rows } from '@lib/db'

export const findFolders = async (userId: number): Promise<EntityFolderType[]> => {
  const res = await db.find(
    `
    SELECT f.id, f.uuid, f.userId, f.name, f.createdAt, f.updatedAt, COUNT(t.id) as count
      FROM quizlet.folders as f
      LEFT JOIN quizlet.terms as t ON t.folderId = f.id
     WHERE f.userId = ?
     GROUP BY f.id
    `,
    [userId]
  )
  return res as EntityFolderType[]
}

export const upsertFolder = async (folder: FolderType): Promise<void> => {
  const res = await db.multiInsert('folders', [folder] as Rows, ['name', 'updatedAt'])
  console.log(res)
}
