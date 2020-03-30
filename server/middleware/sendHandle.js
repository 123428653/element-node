const sendHandle = () => {
  // 统一处理成功请求方法
  const render = ctx => {
    return (data, message = 'success') => {
      ctx.set('Content-Type', 'application/json');
      ctx.body = {
        code: 20000,
        message,
        data
      }
    }
  }

  // 处理失败方法
  const renderError = ctx => {
    return (code, message = 'error') => {
      ctx.set('Content-Type', 'application/json');
      ctx.body = {
        code,
        message,
        data: null
      }
    }
  }

  // 写入全局ctx对象
  return async (ctx, next) => {
    ctx.send = render(ctx);
    ctx.sendError = renderError(ctx);
    await next();
  }
}

module.exports = sendHandle;
