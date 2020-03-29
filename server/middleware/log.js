const log4 = require('koa-log4')
const log4Conf = require('../config/log4')

log4.configure(log4Conf)

exports.logger = log4.koaLogger(log4.getLogger('success'), { level: 'info' })
exports.errLogger = log4.getLogger('errors')