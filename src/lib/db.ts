import { config } from '../../config'
import Mysql from './mysql'

export const db = Mysql.getInstance(config.db.mysql)
export * from './mysql'
