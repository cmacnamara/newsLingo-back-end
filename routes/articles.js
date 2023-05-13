import { Router } from 'express'
import * as articlesCtrl from '../controllers/articles.js'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'

const router = Router()

// ========== Public Routes ===========


// ========= Protected Routes ========= 
router.use(decodeUserFromToken)

//localhost:3001/api/articles
router.get('/', checkAuth, articlesCtrl.index)  
router.get('/:articleId', checkAuth, articlesCtrl.show)
router.post('/', checkAuth, articlesCtrl.create)
router.post('/:articleId', checkAuth, articlesCtrl.createComment)

export { router }