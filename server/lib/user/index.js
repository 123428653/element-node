const query = require('../connect')

// 查询单条用户
exports.findUserSql = ( userName ) => {
    let _sql = `select * from users WHERE userName='${userName}';`
    return query( _sql, null )
}

// 注册新用户
exports.insertUserSql = ( value ) => {
    let _sql = 'insert into users set userName=?,password=?,createTime=?;'
    return query( _sql, value )
}