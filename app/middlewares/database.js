const { join } = require('path')
const glob = require('glob')
const mongoose = require('mongoose')
const config = require('../config')

mongoose.Promise = global.Promise

glob.sync(join(__dirname, '../database', '**/*.js')).forEach(require)
  
exports.initAdmin = async () => {
  const User = mongoose.model('User')
  let user = await User.findOne({
    name: 'lengband'
  })
  if (!user) {
    const user = new User({
      name: 'lengband',
      email: 'lengband@163.com',
      password: '123456',
      role: 'admin'
    })
    console.log(user, 'user')
    
    await user.save()
  }
}

exports.connect = app => {
  const { db } = config

  const connect = db => mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  let maxConnectTimes = 0
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true)
    }
    connect(db)

    mongoose.connection.on('disconnected', () => {
      maxConnectTimes++
      if (maxConnectTimes < 5) {
        connect(db)
      } else {
        throw new Error('数据库挂了，快去修一哈~！')
      }
    })

    mongoose.connection.on('error', error => {
      console.log(error)
      maxConnectTimes++
      if (maxConnectTimes < 5) {
        connect(db)
      } else {
        reject()
        throw new Error('数据库挂了，快去修一哈~！')
      }
    })

    mongoose.connection.once('open', () => {
      console.log('Mongodb Connected Successfully!')
      resolve()
    })
  })
}