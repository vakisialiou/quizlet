import { MysqlConfig } from '@lib/mysql'
import objectPath from 'object-path'
import dotenv from 'dotenv'
import path from 'path'

const params = dotenv.config({ path: path.resolve(process.cwd(), '.env') })

function env<T>(key: string, defaultValue: T): T {
  return objectPath.get(params, ['parsed', key], defaultValue) as T || defaultValue
}

export const ENV_DEV = 'dev'
export const ENV_PROD = 'prod'
export const ENV_LOCAL = 'local'

type AppConfig = {
  db: {
    mysql: MysqlConfig
  }
}

export const config: AppConfig = {
  db: {
    mysql: {
      host: env('MYSQL_HOST', 'localhost'),
      user: env('MYSQL_USER', 'root'),
      password: env('MYSQL_PASSWORD', 'root'),
      database: env('MYSQL_DATABASE', 'demo'),
      connectionLimit: env('MYSQL_CONNECTION_LIMIT', 10),
    },
  },
}
