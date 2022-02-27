const DB_URL = 'mongodb://curry:123456@175.178.58.5:27017/myDb'
import path from 'path'

const REDIS_CONFIG = {
  host: '175.178.58.5',
  port: 15001,
  password: '123456'
}
const frontBaseUrl = process.env.NODE_ENV === 'production' ? 'http://http://175.178.58.5:10090/' : 'http://localhost:8080'
const apiBaseUrl = process.env.NODE_ENV === 'development' ?  'http://localhost:3000' : 'http://175.178.58.5:12005'
const JWT_SECRET = '*fsdjflj^fsdjfbsjf#jlkalkfja*lijiaPflajsldjvnasdrqer434$'
const uploadPath = process.env.NODE_ENV === 'production' ? '/app/public' : path.join(path.resolve(__dirname), '../../public')
export default {
  DB_URL,
  REDIS_CONFIG,
  JWT_SECRET,
  frontBaseUrl,
  uploadPath,
  apiBaseUrl
}