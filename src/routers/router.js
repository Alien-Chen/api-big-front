import combine from 'koa-combine-routers'
import publicRouter from './publicRouter'
import loginRouter from './loginRouter'

const router = combine(
  publicRouter,
  loginRouter
)

export default router