
export enum ENV {
  DEV = 'development',
  PROD = 'production',
}

type AppConfig = {
  sw: {
    enabled: boolean,
    cacheName: string
  },
  server: {
    env: ENV,
    baseURL: string
  },
  db: {
    mysql: {
      port: number,
      host: string,
      username: string,
      password: string,
      database: string,
      connectionLimit: number
    }
  },
  oauth: {
    secret: string,
    redirectURL: string,
    providers: {
      google: {
        clientId: string,
        clientSecret: string,
      },
    }
  }
}

export const config: AppConfig = {
  sw: {
    enabled: process.env.NODE_ENV === ENV.PROD,
    cacheName: process.env.NEXT_PUBLIC_SW_CACHE_NAME || ''
  },
  server: {
    baseURL: process.env.PUBLIC_BASE_URL || '',
    env: process.env.NODE_ENV === ENV.PROD ? ENV.PROD : ENV.DEV,
  },
  oauth: {
    secret: process.env.AUTH_SECRET || '',
    redirectURL: process.env.NEXTAUTH_URL || '',
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
