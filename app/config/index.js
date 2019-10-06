module.exports = {
  db: 'mongodb://localhost/lengband-blog',
  port: 5000, // 服务监听端口
  admin: { // 管理员初始化信息
    username: 'lengband',
    email: 'lengband@163.com',
    password: '123456',
  },
  secret: 'lengband-blog-jwt-secret',
}