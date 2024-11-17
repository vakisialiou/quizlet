import ClientFolder from '@entities/ClientFolder'
import ClientTerm from '@entities/ClientTerm'

export const filterFolders = (folder: ClientFolder | undefined | null): ClientTerm[] => {
  return [...folder?.terms || []].filter(({ answer, question }) => {
    return answer && question
  })
}
