const Koa = require('koa');
const chalk = require('chalk')
const R = require('ramda')
const { join } = require('path')
const config = require('./config')

const MIDDLEWARES = ['database', 'common', 'router']

const useMiddlewares = app => {
  R.map(
    R.compose(
      R.forEachObjIndexed(init => init(app)),
      require,
      name => join(__dirname, `./middlewares/${name}`)
    )
  )(MIDDLEWARES)
}

const start = async () => {
  try {
    const app = new Koa();
    const { port } = config
    await useMiddlewares(app)
    app.listen(port, () => {
      console.log(
        process.env.NODE_ENV === 'development'
          ? `Open ${chalk.green(`http://localhost:${port}`)}`
          : `APP listening on port ${port}`
      )
    })
  } catch (error) {
    console.log(error)
  }
}

start()

