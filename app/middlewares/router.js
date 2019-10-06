const fs = require('fs')
const path = require('path')

exports.useRouter = app => {
  fs.readdirSync(path.join(__dirname, '../routes')).forEach(file => {
    const router = require(`../routes/${file}`)
    app.use(router.routes())
      .use(router.allowedMethods())
  })
}