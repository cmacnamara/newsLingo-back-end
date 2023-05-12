import { Router } from 'express'
import * as articlesCtrl from '../controllers/articles.js'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'

const router = Router()

// ========== Public Routes ===========


// ========= Protected Routes ========= 
router.use(decodeUserFromToken)
router.get('/', checkAuth, articlesCtrl.index)
router.post('/', articlesCtrl.create)

export { router }