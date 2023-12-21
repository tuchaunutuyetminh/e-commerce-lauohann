const router = require('express').Router()
const ctrls = require('../controllers/brand')
const { verifyAccessToken, isAdmin } = require('../middewares/verifyToken')

router.post('/', [verifyAccessToken, isAdmin], ctrls.createNewBrand)
router.get('/', ctrls.getBrands)
router.put('/:bid', [verifyAccessToken, isAdmin], ctrls.updateBrand)
router.delete('/:bid', [verifyAccessToken, isAdmin], ctrls.deleteBrand)





module.exports = router

//CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETE 
// Create (Post) = Put - body

