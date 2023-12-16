const router = require('express').Router()
const ctrls = require('../controllers/product')
const { verifyAccessToken, isAdmin } = require('../middewares/verifyToken')


router.post('/', [verifyAccessToken, isAdmin], ctrls.createProduct)
router.get('/', ctrls.getProducts)

router.delete('/:pid',[verifyAccessToken, isAdmin], ctrls.deleteProduct)
router.put('/:pid',[verifyAccessToken, isAdmin], ctrls.updateProduct)
router.get('/:pid', ctrls.getProduct)


module.exports = router

//CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETE 
// Create (Post) = Put - body

