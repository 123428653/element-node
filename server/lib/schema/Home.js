const mongoose = require('mongoose')
const Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId

/* Mongodb start */
// 创建HomeSchema
const homeSchema = new Schema({
    id: { type: ObjectId},
    title: String,
    isComplete: Boolean
})

// 发布模型
mongoose.model('Home', homeSchema, 'home')
/* Mongodb end */
