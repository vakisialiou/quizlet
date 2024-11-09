import { MysqlConfig } from '@lib/mysql'

export const ENV_DEV = 'dev'
export const ENV_PROD = 'prod'
export const ENV_LOCAL = 'local'

type AppConfig = {
  db: {
    mysql: MysqlConfig
  },
  oauth: {
    secret: string,
    providers: {
      google: {
        clientId: string,
        clientSecret: string,
      },
    }
  }
}

export const config: AppConfig = {
  oauth: {
    secret: process.env.GOOGLE_CLIENT_ID || '',
    providers: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      },
    }
  },
  db: {
    mysql: {
      port: Number(process.env.MYSQL_PORT || 3306),
      host: process.env.MYSQL_HOST || 'localhost',
      username: process.env.MYSQL_USERNAME || 'root',
      password: process.env.MYSQL_PASSWORD || 'root',
      database: process.env.MYSQL_DATABASE || 'demo',
      connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT || 10),
    },
  },
}
