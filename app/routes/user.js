const Router = require('koa-router');
const jwt = require('koa-jwt')
const { find, findById, create, update, del, login, checkOwner, listFollowingTags, followTag, unfollowTag } = require('../controllers/users')
const { checkTagExist } = require('../controllers/tags')
const { secret } = require('../config')

// 认证中间件
const auth = jwt({ secret })

// 自己实现
// const auth = async (ctx, next) => {
//   const { authorization = '' } = ctx.request.header
//   const token = authorization.replace('Bearer ', '')
//   try {
//     const user = jsonwebtoken.verify(token, secret)
//     jsonwebtoken.verify(token, secret, function(err, decoded) {
//       console.log(decoded) // bar
//     })
//     ctx.state.user = user
//   } catch (error) {
//     ctx.throw(401, error.message) // jsonwebtoken 验证失败应该返回 401
//   }
//   await next()
// }

const router = new Router({
  prefix: '/users'
});

router
  .get('/', find) // 用户列表
  .get('/:id', findById) // 用户详情
  .get('/:id/followingTags', listFollowingTags) // 关注标签列表
  .post('/', create) // 创建
  .post('/login', login) // 登录
  .put('/followingTags/:id', auth, checkTagExist, followTag) // 关注标签
  .delete('/:id', auth, checkOwner, del) // 删除
  .delete('/followingTags/:id', auth, checkTagExist, unfollowTag) // 取消关注标签
  .patch('/:id', auth, checkOwner, update) // 修改
  
module.exports = router