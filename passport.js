const passport = require('koa-passport')
const LocalStrategy = require('passport-local').Strategy

const user = {
  id: '1',
  email: 'test@test.ru',
  password: 'ttt',
}

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
    },
    (email, password, done) => {
      // Сравниваем пользователя из хранилища (в нашем случае это объект)
      // с тем что пришло с POST запроса на роутер /login
      // в полях email и password
      console.log(email, password)
      if (email === user.email && password === user.password) {
        // если они совпадают передаем объект user в callback функцию done
        return done(null, user)
      } else {
        // если не соответствуют то отдаем false
        return done(null, false)
      }
    },
  ),
)

passport.serializeUser((user, done) => {
  console.log(user)
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  // здесь необходимо найти пользователя с данным id
  // но он у нас один и мы просто сравниваем
  const _user = user.id === id ? user : false
  done(null, _user)
})

module.exports = passport
