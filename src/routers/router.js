import combine from 'koa-combine-routers'
// import publicRouter from './publicRouter'
// import loginRouter from './loginRouter'
// import userRouter from './userRouter.js'

// 使用webpack api，require.context 来自动化引入某个模块文件
const modules = require.context('./modules', true, /\.js$/)
const routes = modules.keys().reduce((init, path) => {
  const file = modules(path)
  init.push(file.default)
  return init
}, [])

const router = combine(
  routes
)

export default router