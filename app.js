const Koa = require('koa')
const app = new Koa()
// const views = require('koa-views')
// const json = require('koa-json')
// const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-session')
const flash = require('koa-connect-flash')
const convert = require('koa-convert')

const Pug = require('koa-pug')
const path = require('path')
const passport = require('./passport')

const index = require('./routes')
new Pug({
  viewPath: path.resolve(__dirname, './views'),
  pretty: false,
  basedir: './views',
  noCache: true,
  app: app,
})
// error handler
// onerror(app)

app.use(logger())
app.use(require('koa-static')('./public'))

//flash
app.keys = ['keys']
app.use(session({}, app))
app.use(bodyparser())
app.use(convert(flash()))
app.use(passport.initialize())
app.use(passport.session())

// routes
app.use(index.routes()).use(index.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('Server start on port: ', port)
})

module.exports = app
