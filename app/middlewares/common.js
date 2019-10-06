const koaBody = require('koa-body');
const koaError = require('koa-json-error')
const parameter = require('koa-parameter')
const koaStatic = require('koa-static')
const path = require('path')

exports.useCommon = app => {
  app.use(koaStatic(path.join(__dirname, '../public')))
  app.use(parameter(app))
  app.use(koaError({
    postFormat: (e, { stack, ...rest }) => process.env.NODE_ENV === 'production' ? rest : ({ stack, ...rest })
  }))

  app.use(koaBody({
    multipart: true, // 启用文件上传
    formidable: {
      uploadDir: path.join(__dirname, '../public/uploads'),
      keepExtensions: true // 写入uploadDir的文件将包含原文件的扩展名
    }
  }));
}

