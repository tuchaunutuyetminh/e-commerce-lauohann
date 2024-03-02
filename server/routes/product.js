const router = require('express').Router()
const ctrls = require('../controllers/product')
const { verifyAccessToken, isAdmin } = require('../middewares/verifyToken')
const uploader = require('../config/cloudinary.config')

router.post('/', [verifyAccessToken, isAdmin],uploader.fields([
    {name: 'images', maxCount: 10},
    {name: 'thumb', maxCount:  1}
]), ctrls.createProduct)
router.get('/', ctrls.getProducts)
router.put('/ratings',verifyAccessToken, ctrls.ratings)

router.put('/uploadimage/:pid',[verifyAccessToken, isAdmin],uploader.array('images', 10), ctrls.uploadImagesProduct)

router.put('/varriant/:pid',[verifyAccessToken, isAdmin],uploader.fields([
    {name: 'images', maxCount: 10},
    {name: 'thumb', maxCount:  1}
]), ctrls.addVarriant)

router.put('/:pid',[verifyAccessToken, isAdmin],uploader.fields([
    {name: 'images', maxCount: 10},
    {name: 'thumb', maxCount:  1}
]), ctrls.updateProduct)
router.get('/:pid', ctrls.getProduct)
router.delete('/:pid',[verifyAccessToken, isAdmin], ctrls.deleteProduct)




module.exports = router

//CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETE 
// Create (Post) = Put - body

