const Router = require('koa-router')
const controller = require('../controller/c-home')
const axios = require('axios')
let router = new Router()

router.get('/list', controller.getList)

router.post('/add', controller.addSql)

router.post('/del', controller.delSql)

router.post('/update', controller.updateSql)

/* Mongodb start */
/* Mongodb操作 */
// router.get('/home', controller.getHome)
// router.post('/add', controller.addDB)
/* Mongodb end */

// 动态跨域请求
router.post('/all', async ctx => {
  let url = ctx.request.body.url
  await axios.get(url).then(res => {
    ctx.body = res.data
  })
})


// 退出登录（测试）
router.get('/logout', ctx => {
  ctx.session = null
  // console.log(JSON.stringify(ctx.request.body));
  ctx.body = '退出成功！'
  
})

module.exports = router