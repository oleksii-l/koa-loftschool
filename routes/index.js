const router = require('koa-router')()
const koaBody = require('koa-body')
const controllers = require('../controllers')
const validation = require('../utils/validation')


router.get('/', controllers.index)
router.get('/login', controllers.login)
router.get('/admin', validation.isValidAuth, controllers.admin)


router.post(
  '/admin/upload',
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: process.cwd() + '/public/images/products',
    },
  }),
  validation.isValidFile,
  validation.isValidDescFile,
  controllers.upload,
)

router.post('/login', koaBody(), validation.isValidAuth, controllers.auth)

router.post(
  '/',
  koaBody(),
  validation.isValidEmail,
  controllers.email,
)

module.exports = router
