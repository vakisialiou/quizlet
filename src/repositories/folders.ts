import { FolderType } from '@entities/EntityFolder'
import { db } from '@lib/db'

export const findFolders = async (userId: number): Promise<FolderType[]> => {
  const res = await db.find(
    `
    SELECT f.id, f.uuid, f.userId, f.name, f.createdAt, f.updatedAt, COUNT(f.id) as count
      FROM quizlet.folders as f
      LEFT JOIN quizlet.terms as t ON t.folderId = f.id
     WHERE f.userId = ?
     GROUP BY f.id
    `,
    [userId]
  )
  return res as FolderType[]
}
