import mysql2Promise from 'mysql2/promise'

export type MysqlConfig = {
  host: string,
  user: string,
  password: string,
  database: string,
  connectionLimit: number,
}

export type TransactionCallback = { (connection: mysql2Promise.PoolConnection): Promise<void> }
export type Value = (number|string|JSON|Date|null)
export type Row = {[key: string]: Value}
export type Rows = Row[]

export default class Mysql {

  pool: mysql2Promise.Pool

  constructor(config: MysqlConfig) {

    this.pool = mysql2Promise.createPool({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database,
      connectionLimit: config.connectionLimit,
    })
  }

  openConnection(): Promise<mysql2Promise.PoolConnection> {
    return this.pool.getConnection()
  }

  closeConnection(connection: mysql2Promise.PoolConnection): void {
    connection.release()
    this.pool.releaseConnection(connection)
  }

  async transaction(callback: TransactionCallback): Promise<void> {
    const connection = await this.openConnection()

    await connection.beginTransaction()
    try {
      await callback(connection)
      await connection.commit()
    } catch (e) {
      await connection.rollback()
      this.closeConnection(connection)
      throw new Error('MySQL transaction error.', { cause: e })
    }

    this.closeConnection(connection)
  }

  async execute(connection: mysql2Promise.PoolConnection, sql: string, values: (Value[]|Value[][][])): Promise<any> {
    return await connection.query(sql, values)
  }

  // multiInsertExecute(connection: mysql2Promise.PoolConnection, table: string, rows: Rows, updateColumns: string[] = []): Promise<any> {
  //   const { sql, values } = this.generateUpsertSQL(table, rows, updateColumns)
  //   return this.execute(connection, sql, [values])
  // }
  //
  multiInsert(table: string, rows: Rows, updateColumns: string[] = []): Promise<any> {
    const { sql, values } = this.generateUpsertSQL(table, rows, updateColumns)
    return this.query(sql, values)
  }

  generateUpsertSQL(table: string, rows: Rows, updateColumns: string[] = []): { sql: string, values: Value[][][] } {
    const fields = Object.keys(rows[0])
    if (updateColumns.length === 0 && rows.length > 0) {
      updateColumns = fields
    }

    const strInsertColumns = fields.join(', ')
    const strUpdateColumns = updateColumns.map((column) => `${column}=VALUES(${column})`).join(', ')

    return {
      sql: `INSERT INTO ${table} (${strInsertColumns}) VALUES ? ON DUPLICATE KEY UPDATE ${strUpdateColumns}`,
      values: [rows.map((row) => Object.values(row))]
    }
  }

  async query(sql: string, values: (Value[]|Value[][][])): Promise<any> {
    const connection = await this.openConnection()
    try {
      const res = await this.execute(connection, sql, values)
      this.closeConnection(connection)
      return res
    } catch (e) {
      this.closeConnection(connection)
      throw new Error('MySQL query error.', { cause: e })
    }
  }

  async find(sql: string, params: Value[]): Promise<Rows> {
    const res = await this.query(sql, params)
    return res[0] || []
  }

  async findOne(sql: string, params: Value[]): Promise<Row|null> {
    const items = await this.find(sql, params)
    return items.length > 0 ? items[0] : null
  }
}
