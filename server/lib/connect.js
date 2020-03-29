const mysql = require('mysql')
const config = require('../config')

let pool = mysql.createPool({
  host: config.database.host,
  user: config.database.username,
  password: config.database.password,
  database: config.database.database,
  port: config.database.port
})

let query = ( sql, values ) => {

  return new Promise(( resolve, reject ) => {
    pool.getConnection( (err, connection) => {
      if (err) {
        reject( err )
      } else {
        connection.query(sql, values, ( err, rows) => {
          if ( err ) {
            reject( err )
          } else {
            resolve( rows )
          }
          connection.release()
        })
      }
    })
  })

}

// let users =
//     `create table if not exists users(
//      id INT NOT NULL AUTO_INCREMENT,
//      userName VARCHAR(100) NOT NULL COMMENT '用户名',
//      password VARCHAR(100) NOT NULL COMMENT '密码',
//      avator VARCHAR(100) NOT NULL COMMENT '头像',
//      moment VARCHAR(100) NOT NULL COMMENT '注册时间',
//      PRIMARY KEY ( id )
//     );`

/* let posts =
    `create table if not exists posts(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL COMMENT '文章作者',
     title TEXT(0) NOT NULL COMMENT '评论题目',
     content TEXT(0) NOT NULL COMMENT '评论内容',
     md TEXT(0) NOT NULL COMMENT 'markdown',
     uid VARCHAR(40) NOT NULL COMMENT '用户id',
     moment VARCHAR(100) NOT NULL COMMENT '发表时间',
     comments VARCHAR(200) NOT NULL DEFAULT '0' COMMENT '文章评论数',
     pv VARCHAR(40) NOT NULL DEFAULT '0' COMMENT '浏览量',
     avator VARCHAR(100) NOT NULL COMMENT '用户头像',
     PRIMARY KEY(id)
    );`

let comment =
    `create table if not exists comment(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL COMMENT '用户名称',
     content TEXT(0) NOT NULL COMMENT '评论内容',
     moment VARCHAR(40) NOT NULL COMMENT '评论时间',
     postid VARCHAR(40) NOT NULL COMMENT '文章id',
     avator VARCHAR(100) NOT NULL COMMENT '用户头像',
     PRIMARY KEY(id) 
    );`

// 建数据表
let list =
  `create table if not exists users(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL COMMENT '标题',
    isComplete tinyint(11) NOT NULL COMMENT '状态',
    PRIMARY KEY ( id )
  );` */

let users =
  `create table if not exists users(
   id INT NOT NULL AUTO_INCREMENT,
   userName VARCHAR(100) NOT NULL COMMENT '用户名',
   password VARCHAR(100) NOT NULL COMMENT '密码',
   createTime VARCHAR(100) NOT NULL COMMENT '注册时间',
   PRIMARY KEY ( id )
  );`

let createTable = ( sql ) => {
  console.log('创建数据表createTable')
  return query( sql, [] )
}

// 建表
// createTable(users)
// createTable(posts)
// createTable(comment)
createTable(users)

module.exports = query

// 新增
// exports.insertItemSql = ( value ) => {
//   let _sql = "insert into list set title=?,isComplete=?;"
//   return query( _sql, value )
// }

// // 删除用户
// exports.delItemSql = ( id ) => {
//   let _sql = `delete from list where id="${id}";`
//   return query( _sql )
// }

// // 更新修改文章
// exports.updateItemSql = (values) => {
//   let _sql = `update list set title=?,isComplete=? where id=?;`
//   return query(_sql,values)
// }

// // 查询所有列表
// exports.getAllListSql = () => {
//   // let _sql = `select * from list where title="${title}";`
//   let _sql = `select * from list order by id desc;`
//   return query( _sql)
// }

// // 查询单分页列表
// exports.getListSql = (value) => {
//   // let _sql = `select * from list where title="${title}";`
//   let _sql = `select * from list order by id desc limit ?,?;`
//   return query( _sql, value)
// }
