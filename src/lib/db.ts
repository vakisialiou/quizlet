import { config } from '../../config'
import Mysql from './mysql'

export const db = new Mysql(config.db.mysql)
