const router = require('express').Router()
const ctrls = require('../controllers/user')
const { verifyAccessToken } = require('../middewares/verifyToken')


router.post('/register', ctrls.register)
router.post('/login', ctrls.login)
router.get('/current', verifyAccessToken, ctrls.getCurrent)
router.post('/refreshToken', ctrls.refreshAccessToken)
router.get('/logout', ctrls.logout)



module.exports = router

//CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETE 