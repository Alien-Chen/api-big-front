export default function (ctx, next) {
  return next().catch((err) => {
    if (401 == err.status) {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        msg: 'Protected resource, use Authorization header to get access\n'
      }
    } else {
      throw err;
      // ctx.status = err.status || 500 // 状态错误和err的status保持一致
      // ctx.body = Object.assign({
      //   code: 500,
      //   msg: err.message
      // }, process.env.NODE_ENV === 'dev' ? {stack: err.stack} : {})
    }
  })
}