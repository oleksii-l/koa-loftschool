const Joi = require('joi')
const fs = require('fs')
const util = require('util')
const unlink = util.promisify(fs.unlink)

module.exports.isValidFile = async (ctx, next) => {
  const schema = Joi.object().keys({
    name: Joi.string().min(1).max(300).required(),
    size: Joi.number().integer().min(1).required(),
  })

  const { name, size } = ctx.request.files.photo
  const { error } = Joi.validate({ name, size }, schema)

  if (error) {
    const message = error.details.map((el) => el.message).join('; ')

    const { path } = ctx.request.files.photo
    await unlink(path)

    ctx.status = 400
    return (ctx.body = {
      mes: message,
      status: 'Error',
    })
  }
  return next()
}

module.exports.isValidDescFile = async (ctx, next) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(30).required(),
    price: Joi.number().required(),
  })

  const { error } = Joi.validate(ctx.request.body, schema)

  if (error) {
    const message = error.details.map((el) => el.message).join('; ')

    const { path } = ctx.request.files.photo
    await unlink(path)

    ctx.status = 400
    return (ctx.body = {
      mes: message,
      status: 'Error',
    })
  }
  return next()
}

module.exports.isValidEmail = (ctx, next) => {
  const schema = Joi.object().keys({
    name: Joi.string().max(100).required(),
    email: Joi.string().email().required(),
    message: Joi.string().max(1200).required(),
  })
  const { error } = Joi.validate(ctx.request.body, schema)
  if (error) {
    const message = error.details.map((el) => el.message).join('; ')
    console.log(message)
    ctx.flash("emailMessage", message);
    ctx.redirect('#sendemail');
  }
  return next()
}

module.exports.isValidSkills = (ctx, next) => {
  const schema = Joi.object({
    age: Joi.number()
      .min(15)
      .max(100)
      .required(),
    concerts: Joi.number().required(),
    cities: Joi.number().required(),
    years: Joi.number().required()
  });

  const { error } = Joi.validate(req.body, schema);
  if (error) {
    const message = error.details.map((el) => el.message).join('; ')
    ctx.flash("skillsMessage", message);
    ctx.redirect("/admin");
  }
  return next()
}

module.exports.isValidAuth = (ctx, next) => {
  console.log('Validation')
  const schema = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  })
  const { error } = Joi.validate(ctx.request.body, schema)
  if (error) {
    const message = error.details.map((el) => el.message).join('; ')
    console.log(message)
    ctx.flash("message", "Укажите правильный email и пароль");
    ctx.redirect('/login')
  }
  console.log('Next auth')
  return next()
}

module.exports.isAdmin = (ctx, next) => {
  if (ctx.isAuthenticated()) {
    return next()
  }
}
