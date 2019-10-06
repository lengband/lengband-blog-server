const mongoose = require('mongoose')

const { Schema, model } = mongoose

const tagSchema = new Schema({
  __v: {
    type: Number,
    select: false // 隐藏字段
  },
  name: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // 将自动添加 createAt 和 updateAt 两个字段
})

module.exports = model('Tag', tagSchema);
