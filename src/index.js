import path from 'path'
import Koa from 'koa'
import koaBody from 'koa-body'
import koaJson from 'koa-json'
import statics from 'koa-static'
import routers from './routers/router'
import compose from 'koa-compose'
import compress from 'koa-compress'
import cors from '@koa/cors'
import JWT from 'koa-jwt'
import config from './config/index'
import ErrorHandle from './utils/ErrorHandle'
const app = new Koa()

// jwt
const jwt = JWT({ secret: config.JWT_SECRET }).unless({ path: [/^\/public/, /^\/login/] })

const isDevMode = process.env.NODE_ENV !== 'production'
const middleware = compose([
  koaBody({
    multipart: true,
    formidable: {
      keepExtensions: true,
      maxFieldsSize: 5 * 1024 * 1024
    },
    onError: err => {
      console.log('koabody TCL: err', err)
    }
  }),
  koaJson(),
  cors(),
  statics(path.join(__dirname, '../public')),
  ErrorHandle,
  jwt
])
console.log('index', path.join(__dirname, '../public'))
app.use(middleware)
if (!isDevMode) {
  app.use(compress())
}

let port = !isDevMode ? 12005 : 3000
// let port = 3000

app.use(routers())

app.listen(port, () => {
  console.log(`the server is running: ${port}`)
})