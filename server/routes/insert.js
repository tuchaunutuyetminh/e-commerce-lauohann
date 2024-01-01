const router = require('express').Router()
const ctrls = require('../controllers/insertData')

router.post('/', ctrls.insertProduct)
router.post('/cate', ctrls.insertCategory)



module.exports = router

//CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETE 
// Create (Post) = Put - body

