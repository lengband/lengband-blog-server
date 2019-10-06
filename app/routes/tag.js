const Router = require('koa-router');
const jwt = require('koa-jwt')
const { find, findById, create, update, del, listTagFollowers, checkTagExist } = require('../controllers/tags')
const { secret } = require('../config')

// 认证中间件
const auth = jwt({ secret })

const router = new Router({
  prefix: '/tags'
});

router
  .get('/', find)
  .get('/:id', findById)
  .get('/:id/followers', checkTagExist, listTagFollowers)  // 关注该话题的人
  .post('/', auth, create)
  .patch('/:id', auth, checkTagExist, update)
  .del('/:id', auth, checkTagExist, del)

module.exports = router