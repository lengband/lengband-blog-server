const jsonwebtoken = require('jsonwebtoken')
const User = require('../database/users')
const { secret } = require('../config')

const verifyParams = {
  name: {
    type: 'string',
    required: true
  },
  password: {
    type: 'string',
    required: true
  }
}


class UserCtl {
  async find (ctx) {
    const { per_page = 10 } = ctx.query
    const page = Math.max(ctx.query.page * 1, 1) - 1 // 转换为数字
    const perPage = Math.max(per_page * 1, 1)
    ctx.body = await User
    .find({ name: new RegExp(ctx.query.q) })
    .limit(perPage).skip(perPage * page)
  }
  async findById (ctx) {
    const { fields = '' } = ctx.query
    const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
    const populateStr = fields.split(';').filter(f => f).join(' ')
    const user = await User.findById(ctx.params.id).select(selectFields)
      .populate(populateStr)
    if (!user) {
      ctx.throw(404, '用户不存在')
    } else {
      ctx.body = user
    }
  }
  async create (ctx) {
    ctx.verifyParams(verifyParams)
    const { name } = ctx.request.body
    const repeatedUser = await User.findOne({ name })
    if (repeatedUser) ctx.throw(409, '用户已经存在')
    const user = await new User(ctx.request.body).save()
    ctx.body = user
  }
  // 授权中间件
  async checkOwner (ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403, '没有权限')
    }
    await next()
  }
  async update (ctx) {
    ctx.verifyParams({
      name: {
        type: 'string',
        required: true
      },
      password: {
        type: 'string',
        required: false
      },
      avatar_url: {
        type: 'string',
        required: false
      },
      gender: {
        type: 'string',
        required: false
      },
      role: {
        type: 'string',
        required: false,
      },
      locations: {
        type: 'string',
        required: false
      },
    })
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!user) ctx.throw(404, '用户不存在')
    ctx.body = user
  }
  async del (ctx) {
    const user = await User.findByIdAndDelete(ctx.params.id)
    ctx.body = user
  }
  async login (ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })
    const user = await User.findOne(ctx.request.body)
    if (!user) ctx.throw(401, '用户名或密码不正确')
    const { _id, name } = user
    const token = jsonwebtoken.sign({
      _id,
      name
    }, secret, {
      expiresIn: '1d'
    })
    ctx.body = { token }
  }
  
  async checkUserExist (ctx, next) { // 中间件，检查 params.id 是否存在
    const user = await User.findById(ctx.params.id)
    if (!user) ctx.throw(404, '用户不存在')
    await next()
  }
  async followTag (ctx) { // 关注标签
    const me = await User.findById(ctx.state.user._id).select('+followingTags') // 登录人的关注者列表
    if (!me.followingTags.map(id => id.toString()).includes(ctx.params.id)) {
      me.followingTags.push(ctx.params.id)
      me.save()
    }
    ctx.status = 200
  }
  async listFollowingTags (ctx) { // 用户关注标签列表
    const user = await User.findById(ctx.params.id).select('+followingTags').populate('followingTags')
    if (!user) ctx.throw(404, '用户不存在')
    ctx.body = user.followingTags
  }
  async unfollowTag (ctx) { // 取消关注标签
    const me = await User.findById(ctx.state.user._id).select('+followingTags') // 登录人的关注者列表
    const index = me.followingTags.map(id => id.toString()).indexOf(ctx.params.id)
    if (index > -1) {
      me.followingTags.splice(index, 1)
      me.save()
    }
    ctx.status = 204
  }
}

module.exports = new UserCtl()