import { Router } from 'express'
import * as articlesCtrl from '../controllers/articles.js'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'

const router = Router()

// ========== Public Routes ===========


// ========= Protected Routes ========= 
router.use(decodeUserFromToken)

//localhost:3001/api/articles
router.get('/',  articlesCtrl.index)  //checkAuth removed -----remember to add back once front end is built
router.post('/', articlesCtrl.create) //checkAuth removed -----remember to add back once front end is built

export { router }