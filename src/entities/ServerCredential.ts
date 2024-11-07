
export type ServerCredentialType = {
  id: number
  userId: number
  accountId: string
  accessToken: string
  refreshToken: string
  createdAt: Date
  updatedAt: Date
}

export default class ServerCredential {
  id: number | null
  userId: number | null
  accountId: string | null
  accessToken: string | null
  refreshToken: string | null
  createdAt: Date
  updatedAt: Date

  constructor() {
    this.id = null
    this.userId = null
    this.accountId = null
    this.accessToken = null
    this.refreshToken = null
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }

  setId(value: number): ServerCredential {
    this.id = value
    return this
  }

  setUserId(value: number): ServerCredential {
    this.userId = value
    return this
  }

  setAccountId(value: string): ServerCredential {
    this.accountId = value
    return this
  }

  setRefreshToken(value: string): ServerCredential {
    this.refreshToken = value
    return this
  }

  setAccessToken(value: string): ServerCredential {
    this.accessToken = value
    return this
  }

  setCreatedAt(value: Date | string): ServerCredential {
    this.createdAt = new Date(value)
    return this
  }

  setUpdatedAt(value: Date | string): ServerCredential {
    this.updatedAt = new Date(value)
    return this
  }
}
