const router = require('koa-router')()
const model = require('../lib/user')
const md5 = require('md5')
const jwt = require('jsonwebtoken')

// 注册
router.post('/register', async ctx => {
    let { username, password } = ctx.request.body
    let len = 0
    await model.findUserSql(username).then(result => {
        console.log(result, 888)
        len = result.length
    })
    if (!len) {
        let d = new Date()
        let y = d.getFullYear()
        let m = d.getMonth() + 1
        let date = d.getDate()
        await model.insertUserSql([username, md5(password), `${y}-${m}-${date}`]).then((a) => {
            console.log(a, 77)
            // ctx.body = {
            //     status: 200,
            //     message: 'success'
            // }
            ctx.send(null, '注册成功')
        })
    } else {
        // ctx.body = {
        //     status: 0,
        //     message: '用户已存在，请更换其他帐号。'
        // }
        ctx.sendError(0, '用户已存在，请更换其他帐号。');
    }
})

// 登录
router.post('/login', async ctx => {
    let {username, password} = ctx.request.body
    password = md5(password)
    await model.findUserSql(username).then(result => {
        console.log(result, '登录')
        if (!result.length) {
            // ctx.body = {
            //     status: 0,
            //     message: '用户不存在，请先注册。'
            // }
            ctx.sendError(0, '用户不存在，请先注册。');
            return
        }
        if (result[0].password === password) {
            const token = jwt.sign({
                username,
                password
            },'log_token', {expiresIn: '1h'});
            // ctx.body = {
            //     status: 200,
            //     message: '登录成功',
            //     data: {
            //         token
            //     }
            // }
            
            ctx.send({token}, '登录成功')
        } else {
            // ctx.body = {
            //     status: 0,
            //     message: '密码错误'
            // }
            ctx.sendError(0, '密码错误');
        }
    })
})

module.exports = router