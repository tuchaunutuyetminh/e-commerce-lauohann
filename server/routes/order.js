const router = require('express').Router()
const ctrls = require('../controllers/order')
const { verifyAccessToken, isAdmin } = require('../middewares/verifyToken')

router.post('/', [verifyAccessToken], ctrls.createNewOrder)
router.put('/status/:oid', [verifyAccessToken, isAdmin], ctrls.updateStatus)
router.get('/admin',[verifyAccessToken, isAdmin], ctrls.getOrders)
router.get('/',verifyAccessToken, ctrls.getUserOrder)
// router.delete('/:cid', [verifyAccessToken, isAdmin], ctrls.deleteCoupons)





module.exports = router

//CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETE 
// Create (Post) = Put - body

