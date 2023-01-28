import { createClient } from 'redis'
import redisConfig from '~config/redis'
import { RedisJSON } from '@redis/json/dist/commands'

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

export const set = async (key: string, value: unknown, seconds = 0) => {
  await openConnect()
  const data = JSON.stringify({ redisData: value })
  if (seconds > 0) {
    await client.setEx(key, seconds, data)
  } else {
    await client.set(key, data)
  }
}

export const get = async (key: string) => {
  await openConnect()
  const data = await client.get(key)
  if (data) {
    return JSON.parse(data).redisData
  }
  return data
}

export const remember = async (key: string, seconds: number, fn: () => any) => {
  let data = await get(key)
  if (!data) {
    data = await fn()
    if (data) {
      await set(key, data, seconds)
    }
  }
  return data
}
