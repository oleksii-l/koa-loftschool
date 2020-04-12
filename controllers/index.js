const db = require('../db')
const path = require('path')
const fs = require('fs')
const util = require('util')
const rename = util.promisify(fs.rename)
const sgMail = require('@sendgrid/mail')
const utils = require('../utils')
require('dotenv').config({ path: __dirname + '/.env' })
const passport = require('../passport')

module.exports.index = async (ctx) => {
  const skills = utils.getAllSkills()
  const products = utils.getAllProducts()

  await ctx.render('pages/index', {
    skills,
    products,
    msgemail: ctx.flash('emailMessage'),
  })
}

module.exports.admin = async (ctx) => {
  await ctx.render('pages/admin')
}

module.exports.login = async (ctx) => {
  await ctx.render('pages/login', { msglogin: ctx.flash('message') })
}

module.exports.upload = async (ctx) => {
  const { name: fileName, path: filePath } = ctx.request.files.photo

  const { name, price } = ctx.request.body
  console.log(__dirname)
  console.log(process.cwd())
  let destFile = path.join(process.cwd(), 'public', 'images', 'products', fileName)
  const errUpload = await rename(filePath, destFile)
  if (errUpload) {
    return (ctx.body = {
      mes: 'Something went wrong try again...',
      status: 'Error',
    })
  }
  utils.saveProduct({ name, price, file: ctx.request.files.photo.name })

  ctx.redirect('/admin')
}

module.exports.auth = async (ctx) => {
  console.log('In: controller')
  return await passport.authenticate('local', async (err, user) => {
    console.log('In passport', user)
    if (err) {
      ctx.body = err
    }
    if (!user) {
      ctx.flash('message', 'Укажите правильный email и пароль')
      await ctx.redirect('/login')
    } else {
      ctx.login(user, async (err) => {
        await ctx.redirect('/admin') //auth successfully passed
      })
    }
  })(ctx)
}

module.exports.skills = async (ctx) => {
  adminCtrl.saveSkills(req.body);
  ctx.redirect("/");
}

module.exports.email = async (ctx) => {
  console.log('Email')
  const { name, email, message } = ctx.request.body
  try {
    console.log(process.env.SEND_GRID_API_KEY)
    sgMail.setApiKey(process.env.SEND_GRID_API_KEY)
    const msg = {
      to: 'simple2001@ukr.net',
      from: email,
      subject: `Sending email from ${name}`,
      text: message,
    }
    sgMail.send(msg)
  } catch (err) {
    ctx.flash("emailMessage", message);
    ctx.redirect('#sendemail')
  }
  ctx.redirect('/')
}
