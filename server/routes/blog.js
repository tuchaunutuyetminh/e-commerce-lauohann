const router = require('express').Router()
const {verifyAccessToken, isAdmin} = require('../middewares/verifyToken')
const ctrls = require('../controllers/blog')

router.post('/', [verifyAccessToken, isAdmin], ctrls.createNewBlog)
router.get('/', ctrls.getBlogs)
router.delete('/:bid',[verifyAccessToken, isAdmin], ctrls.deleteBlog)
router.get('/one/:bid', ctrls.getBlog)
router.put('/like/:bid', [verifyAccessToken], ctrls.likeBlog)
router.put('/dislike/:bid', [verifyAccessToken], ctrls.dislikeBlog)
router.put('/:bid', [verifyAccessToken, isAdmin], ctrls.updateBlog)



module.exports = router