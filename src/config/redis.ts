import { ConfigType } from '~config/types/redis'

const config: ConfigType = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: (process.env.REDIS_PORT || 5432) as number,
}

export default config
