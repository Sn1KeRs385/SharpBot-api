import { ConfigType } from '~config/types/database'

const config: ConfigType = {
  default: process.env.DB_DEFAULT_CONNECTION || 'pg',

  connections: {
    pg: {
      client: process.env.DB_PG_CLIENT || 'pg',
      host: process.env.DB_PG_HOST || '127.0.0.1',
      port: (process.env.DB_PG_PORT || 5432) as number,
      database: process.env.DB_PG_DATABASE || 'postgres',
      user: process.env.DB_PG_USER || 'postgres',
      password: process.env.DB_PG_PASSWORD || 'postgres',
    },
  },
}

export default config
