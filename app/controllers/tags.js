const Tag = require('../database/tags')
const User = require('../database/users')

const verifyParams = {
  name: {
    type: 'string',
    required: true
  },
}


class TagsCtl {
  // 标签是否存在
  async checkTagExist (ctx, next) {
    const tag = await Tag.findById(ctx.params.id)
    if (!tag) ctx.throw(404, '标签不存在')
    await next()
  }
  async find (ctx) {
    const { per_page = 10 } = ctx.query
    const page = Math.max(ctx.query.page * 1, 1) - 1 // 转换为数字
    const perPage = Math.max(per_page * 1, 1)
    ctx.body = await Tag
    .find({ name: new RegExp(ctx.query.q) }) // .find({ name: '清华大学' }) // 精确匹配
    .limit(perPage).skip(page * perPage)
  }
  async findById (ctx) {
    const { fields = '' } = ctx.query
    const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
    const tag = await Tag.findById(ctx.params.id).select(selectFields)
    if (!tag) {
      ctx.throw(404, '标签不存在')
    } else {
      ctx.body = tag
    }
  }
  async create (ctx) {
    ctx.verifyParams(verifyParams)
    const { name } = ctx.request.body
    const repeatedTag = await Tag.findOne({ name })
    if (repeatedTag) ctx.throw(409, '用户已经存在')
    const tag = await new Tag(ctx.request.body).save()
    ctx.body = tag
  }
  async update (ctx) {
    ctx.verifyParams(Object.assign({}, verifyParams, { name: { type: 'string', required: false } }))
    const tag = await Tag.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!tag) ctx.throw(404, '用户不存在')
    ctx.body = tag
  }
  async del (ctx) {
    // const tag = await Tag.findByIdAndDelete(ctx.params.id)
    ctx.body = '暂不开放删除标签功能'
  }
  async listTagFollowers (ctx) { // 关注该标签的人
    const user = await User.find({ followingTags: ctx.params.id })
    ctx.body = user
  }
}

module.exports = new TagsCtl()