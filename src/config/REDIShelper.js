import { createClient } from "redis"
import config from './index.js'
const { REDIS_CONFIG } = config
let client;
const init = async () => {
  // console.log(REDIS_CONFIG.password)
  client = createClient({
    url: `redis://:${REDIS_CONFIG.password}@${REDIS_CONFIG.host}:${REDIS_CONFIG.port}`
  })
 await client.connect()
}

init()

const add = async (key, value, time) => {
  if (typeof value == undefined || value === '') {
    return
  }
  if (typeof value === 'string') {
    if (time) {
      return await client.set(key, value, { EX: time })
    } else {
      return await client.set(key, value)
    }
  }

  if (Object.prototype.toString(value) === 'Array') {
    return await client.lPush(key, value)
  }
  if (Object.prototype.toString(value) === '[object Object]') {
    const keys = Object.keys(value)
    for (let item of keys) {
      await client.HSET(key, item, value[item])
    }
  }
}

const getValue = async (key) => {
  return await client.get(key)
}

const getHashValue = async (key) => {
  return await client.hGetAll(key)
}

export {
  add,
  getValue,
  getHashValue
}
