const mongoose = require('mongoose')
const db = 'mongodb://localhost/koa2_DB'
const glob = require('glob')
const {resolve} = require('path')
/* Mongodb start */
exports.initSchemas = () => {
    glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require)
}

exports.connect = () => {
    mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    let maxConnectNum = 0

    return new Promise((resolve, reject) => {
        mongoose.connection.on('disconnected', (err) => {
            console.log('*******************数据库断开***************')
            if (maxConnectNum <= 3) {
                maxConnectNum++
                mongoose.connect(db, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                })
            } else {
                reject(err)
                throw Error('数据库出问题了，需要处理一下~')
            }
        })
    
        mongoose.connection.on('error', (err) => {
            console.log('*******************数据库错误***************')
            if (maxConnectNum <= 3) {
                maxConnectNum++
                mongoose.connect(db, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                })
            } else {
                reject(err)
                throw Error('数据库出问题了，需要处理一下~')
            }
        })
    
        mongoose.connection.once('open', () => {
            console.log('*******************数据库链接成功***************')
            resolve()
        })
    })
    
}
/* Mongodb end */
