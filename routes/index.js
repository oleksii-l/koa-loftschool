const router = new require('koa-router')()
const koaBody = require('koa-body')
const controllers = require('../controllers')
const validation = require('../utils/validation')

router.get('/', controllers.index)
router.post('/', koaBody(), validation.isValidEmail, controllers.email)

router.get('/login', controllers.login)
router.post('/login', validation.isValidAuth, controllers.auth)

router.get('/admin', validation.isAdmin, controllers.admin)

router.post(
  '/admin/upload',
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: process.cwd() + '/public/images/products',
    },
  }),
  validation.isAdmin,
  validation.isValidFile,
  validation.isValidDescFile,
  controllers.upload,
)

module.exports = router
