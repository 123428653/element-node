const query = require('../connect')

// 新增
exports.insertItemSql = ( value ) => {
  let _sql = "insert into list set title=?,isComplete=?;"
  return query( _sql, value )
}

// 删除用户
exports.delItemSql = ( id ) => {
  let _sql = `delete from list where id="${id}";`
  return query( _sql )
}

// 更新修改文章
exports.updateItemSql = (values) => {
  let _sql = `update list set title=?,isComplete=? where id=?;`
  return query(_sql,values)
}

// 查询所有列表
exports.getAllListSql = () => {
  // let _sql = `select * from list where title="${title}";`
  let _sql = `select * from list order by id desc;`
  return query( _sql)
}

// 查询单分页列表
exports.getListSql = (value) => {
  // let _sql = `select * from list where title="${title}";`
  let _sql = `select * from list order by id desc limit ?,?;`
  return query( _sql, value)
}
