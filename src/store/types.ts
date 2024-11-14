import ClientFolder from '@entities/ClientFolder'

export type FoldersType = {
  process: boolean
  items: ClientFolder[]
  editId: string | null
  processIds: string[]
}

export type ConfigType = {
  folders: FoldersType
}
