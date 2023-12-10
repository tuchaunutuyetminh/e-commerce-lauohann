const router = require('express').Router()
const ctrls = require('../controllers/user')
const { verifyAccessToken } = require('../middewares/verifyToken')


router.post('/register', ctrls.register)
router.post('/login', ctrls.login)
router.get('/current', verifyAccessToken, ctrls.getCurrent)


module.exports = router

//CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETE 