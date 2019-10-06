const mongoose = require('mongoose')

const { Schema, model } = mongoose

const userSchema = new Schema({
  __v: {
    type: Number,
    select: false // 隐藏字段
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  avatar_url: { // 头像
    type: String,
  },
  gender: { // 性别
    type: String,
    enum: ['male', 'female'],
    default: 'male',
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  locations: { // 居住地
    type: String,
    select: false,
  },
  followingTags: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Tag',
    }],
    select: false
  },
}, {
  timestamps: true, // 将自动添加 createAt 和 updateAt 两个字段
})

module.exports = model('User', userSchema);