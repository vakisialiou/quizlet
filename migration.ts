// @ts-ignore
import migration from 'mysql-migrations'
import { config } from './config'
import mysql2 from 'mysql2'
import path from 'path'

const pool = mysql2.createPool({
  host: config.db.mysql.host,
  user: config.db.mysql.user,
  password: config.db.mysql.password,
  database: config.db.mysql.database,
  connectionLimit: config.db.mysql.connectionLimit,
})

migration.init(pool, path.resolve('migrations'))
