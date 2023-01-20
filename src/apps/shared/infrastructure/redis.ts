import { createClient } from 'redis'
import redisConfig from '~config/redis'

const client = createClient({
  socket: {
    host: redisConfig.host,
    port: redisConfig.port,
  },
})

const openConnect = async () => {
  if (!client.isOpen) {
    await client.connect()
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const set = async (key: string, value: string) => {
  await openConnect()
  await client.set(key, value)
  // await client.disconnect()
}

export const get = async (key: string) => {
  await openConnect()
  return await client.get(key)
  // await client.disconnect()
}
