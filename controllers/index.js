const db = require("../db");
const path = require("path");
const fs = require('fs')
const util = require('util')
const rename = util.promisify(fs.rename)
const sgMail = require("@sendgrid/mail");
const utils = require("../utils");
require("dotenv").config({ path: __dirname + "/.env" });

module.exports.index = async (ctx) => {
  const skills = utils.getAllSkills();
  const products = utils.getAllProducts();

  await ctx.render("pages/index", { skills, products, msgemail: ctx.flash("emailMessage") });
}

module.exports.admin = async (ctx) => {
  await ctx.render('pages/admin')
}

module.exports.login = async (ctx) => {
  await ctx.render("pages/login", { msglogin: ctx.flash("message") });
}

module.exports.upload = async (ctx) => {
  const { fileName, path: filePath } = ctx.request.files.photo

  const { name, price } = ctx.request.body
  console.log(__dirname)
  console.log(process.cwd())
  let destFile = path.join(process.cwd(), 'public', 'images', 'products', name)
  const errUpload = await rename(filePath, destFile)
  if (errUpload) {
    return (ctx.body = {
      mes: 'Something went wrong try again...',
      status: 'Error',
    })
  }
  utils.saveProduct({ name, price, file: ctx.request.files.photo.name });

  ctx.redirect('/admin')
}


module.exports.auth = async (ctx) => {
  return passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      ctx.flash("message", "Укажите правильный email и пароль");
      ctx.redirect("/login");
    }
    ctx.login(user, err => {
      ctx.redirect("/admin"); //auth successfully passed
    });
  })(ctx);  

}

module.exports.email = async (ctx) => {
  const { name, email, message } = ctx.request.body
  try {
    console.log(process.env.SEND_GRID_API_KEY)
    sgMail.setApiKey(process.env.SEND_GRID_API_KEY)
    const msg = {
      to: 'krabat@ex.ua',
      from: email,
      subject: `Sending email from ${name}`,
      text: message,
    }
    sgMail.send(msg)
  } catch (err) {
    return (ctx.body = {
      mes: err.message,
      status: 'Error',
    })
  }
  ctx.body = {
    mes: 'Done',
    status: 'OK',
  }
}
