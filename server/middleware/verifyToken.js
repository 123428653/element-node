const verifyToken = (ctx, next) => {
  return next().catch(err => {
    if (err.status === 401) {
      ctx.status = 401;
      return ctx.sendError(0, 'Token失效，拒绝访问')
      // return ctx.body = {
      //   status: 0,
      //   message: 'Token失效，拒绝访问',
      //   data: null
      // }
    } else {
      throw err;
    }
  })
}

module.exports = verifyToken;