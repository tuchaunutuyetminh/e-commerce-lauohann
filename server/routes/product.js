const router = require('express').Router()
const ctrls = require('../controllers/product')
const { verifyAccessToken, isAdmin } = require('../middewares/verifyToken')
const uploader = require('../config/cloudinary.config')

router.post('/', [verifyAccessToken, isAdmin], ctrls.createProduct)
router.get('/', ctrls.getProducts)
router.put('/ratings',verifyAccessToken, ctrls.ratings)

router.put('/uploadimage/:pid',[verifyAccessToken, isAdmin],uploader.array('images', 10), ctrls.uploadImagesProduct)
router.delete('/:pid',[verifyAccessToken, isAdmin], ctrls.deleteProduct)
router.put('/:pid',[verifyAccessToken, isAdmin], ctrls.updateProduct)
router.get('/:pid', ctrls.getProduct)



module.exports = router

//CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETE 
// Create (Post) = Put - body

