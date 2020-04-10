const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-session')
const flash = require('koa-connect-flash')

const passport = require("koa-passport");
const LocalStrategy = require("passport-local").Strategy;

const index = require('./routes/index')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

//flash
app.keys = ['keys'];
app.use(session(app));
app.use(flash());

//passport
const user = {
  id: '1',
  email: 'loft@loftschool.com',
  password: 'password'
};

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email'
    },
    (email, password, done) => {
      // Сравниваем пользователя из хранилища (в нашем случае это объект)
      // с тем что пришло с POST запроса на роутер /login
      // в полях email и password
      if (email === user.email && password === user.password) {
        // если они совпадают передаем объект user в callback функцию done
        return done(null, user);
      } else {
        // если не соответствуют то отдаем false
        return done(null, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // здесь необходимо найти пользователя с данным id
  // но он у нас один и мы просто сравниваем
  const _user = user.id === id ? user : false;
  done(null, _user);
});


app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(passport.initialize());
app.use(passport.session());

// routes
app.use(index.routes(), index.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
