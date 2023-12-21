const router = require('express').Router()
const ctrls = require('../controllers/coupon')
const { verifyAccessToken, isAdmin } = require('../middewares/verifyToken')

router.post('/', [verifyAccessToken, isAdmin], ctrls.createNewCoupon)
router.get('/', ctrls.getCoupons)
router.put('/:cid', [verifyAccessToken, isAdmin], ctrls.updateCoupon)
router.delete('/:cid', [verifyAccessToken, isAdmin], ctrls.deleteCoupons)





module.exports = router

//CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETE 
// Create (Post) = Put - body

