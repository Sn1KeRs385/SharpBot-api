export type ConnectionOptions = {
  client: string
  host: string
  port: number
  database: string
  user: string
  password: string
}

export type ConfigType = {
  default: string
  connections: {
    [key: string]: ConnectionOptions
  }
}
