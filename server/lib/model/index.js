const mongoose = require('mongoose')

/* 模型对象 */
/* Mongodb start */
exports.home = () => {
    return mongoose.model('Home')
}
/* Mongodb end */
