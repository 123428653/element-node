const Koa = require('koa')
var path = require('path')
var staticCache = require('koa-static-cache')
var koaBody = require('koa-body')
// const session = require('koa-session-minimal')  // session回话（cookie标识）
// const MysqlStore = require('koa-mysql-session') // 存入mysql中
const cors = require('koa2-cors') // 解决跨域问题
const router = require('koa-router')()
const config = require('./config')
const {logger, errLogger} = require('./middleware/log') // 日志
const sendHandle = require('./middleware/sendHandle')
const verifyToken = require('./middleware/verifyToken')
const koajwt = require('koa-jwt')
// let home = require('./api/home')
let user = require('./api/user')
const app = new Koa()

// 模块化路由
// router.use('/home', home.routes())  // home模块
router.use('/api/user', user.routes())  // user模块


// 获取数据库登录信息，方便存储seesion
// let sessionMysqlConfig = {
//   user: config.database.username,
//   password: config.database.password,
//   database: config.database.database,
//   host: config.database.host
// }

// koa-session-minimal需要一个options对象参数：
/***
 * key：会话cookie名称和商店密钥前缀
   store：会话外部存储
   cookie：cookie选项，可以是对象（静态cookie选项）或返回对象的函数（动态cookie选项）参数为ctx对象。
   只有maxAge，path，domain，secure，httpOnly是支持的。
 */
// app.use(session({
//   key: 'SID',
//   store: new MysqlStore(sessionMysqlConfig)
// }))

// 设置静态资源目录
app.use(staticCache(path.join(__dirname, 'public'), {
  maxAge: 365 * 24 * 60 * 60
}))


// 错误处理
app.onerror = (err) => {
  console.log('捕获到了!', err.message);
  errLogger.error(err.message)
}

// 处理post请求body部分
app.use(koaBody({
  multipart:true, // 支持文件上传
  // encoding:'gzip',
  formidable:{
    uploadDir:path.join(__dirname,'public/upload/'), // 设置文件上传目录
    keepExtensions: true,    // 保持文件的后缀
    maxFieldsSize:2 * 1024 * 1024, // 文件上传大小
    // onFileBegin:(name,file) => { // 文件上传前的设置
    //   // console.log(`name: ${name}`);
    //   // console.log(file);
    // }
  }
}))
.use(cors({
  origin: (ctx) => {
    if (ctx.url === '/test') {
      return false
    }
    return '*'
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept']
}))
.use(sendHandle())
.use(verifyToken)
.use(koajwt({
  secret: 'log_token'
}).unless({
  // 设置不需要验证token的白名单
  path: [/\/user\/register/, /\/user\/login/]
}))
.use(logger)
.use(router.routes())
.use(router.allowedMethods())


app.use(async (ctx, next) => {
  await next();
  if (ctx.url === '/' && ctx.method === 'GET') {
    ctx.body = '<h1>Hello Koa2!</h1>';
  }
})




app.listen(3000);
