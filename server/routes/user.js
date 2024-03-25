const router = require('express').Router()
const ctrls = require('../controllers/user')
const { verifyAccessToken, isAdmin } = require('../middewares/verifyToken')
const uploader = require('../config/cloudinary.config')

router.post('/register', ctrls.register)
router.post('/mock', ctrls.createUsers)
router.put('/finalregister/:token', ctrls.finalRegister)
router.post('/login', ctrls.login)
router.get('/current', verifyAccessToken, ctrls.getCurrent)
router.post('/refreshToken', ctrls.refreshAccessToken)
router.get('/logout', ctrls.logout)
router.post('/forgotpassword', ctrls.forgotPassword)
router.put('/resetpassword', ctrls.resetPassword)
router.get('/',[verifyAccessToken, isAdmin], ctrls.getUsers)
router.put('/current',verifyAccessToken,uploader.single('avatar'), ctrls.updateUser)
router.put('/address',[verifyAccessToken], ctrls.updateUserAddress)
router.put('/cart',[verifyAccessToken], ctrls.updateCart)
router.delete('/remove-cart/:pid/:color',[verifyAccessToken], ctrls.removeProductInCart)
router.delete('/:uid',[verifyAccessToken, isAdmin], ctrls.deleteUser)
router.put('/wishlist/:pid',[verifyAccessToken], ctrls.updateWishList)

router.put('/:uid',[verifyAccessToken, isAdmin], ctrls.updateUserByAdmin)





module.exports = router

//CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETE 
// Create (Post) = Put - body

