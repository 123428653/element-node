const router = require('koa-router')()
const mode = require('../lib/user')

router.post('/register', async ctx => {
    let { userName, password } = ctx.request.body
    let len = 0
    await mode.findUserSql(userName).then(result => {
        console.log(result, 888)
        len = result.length
    })
    if (!len) {
        let d = new Date()
        let y = d.getFullYear()
        let m = d.getMonth() + 1
        let date = d.getDate()
        await mode.insertUserSql([userName, password, `${y}-${m}-${date}`]).then((a) => {
            console.log(a, 77)
            ctx.body = {
                status: 200,
                message: 'success'
            }
        })
    } else {
        ctx.body = {
            status: 0,
            message: '用户已存在，请更换其他帐号'
        }
    }
})

module.exports = router