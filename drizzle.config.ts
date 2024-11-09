import type { Config } from 'drizzle-kit'
import { config } from '@config'

export default {
  schema: './schema/*',
  out: './migrations',
  dialect: 'mysql',
  dbCredentials: {
    host: config.db.mysql.host,
    port: config.db.mysql.port,
    user: config.db.mysql.user,
    password: config.db.mysql.password,
    database: config.db.mysql.database
  },
} satisfies Config;
