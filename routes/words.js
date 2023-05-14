import { Router } from 'express'
import * as wordsCtrl from '../controllers/words.js'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'

const router = Router()

// ========== Public Routes ===========


// ========= Protected Routes ========= 
router.use(decodeUserFromToken)

//localhost:3001/api/words
router.post('/', checkAuth, wordsCtrl.create)
router.get('/', checkAuth, wordsCtrl.index)  
router.get('/:wordId', checkAuth, wordsCtrl.show)
router.get('/:wordId', checkAuth, wordsCtrl.delete)


export { router }