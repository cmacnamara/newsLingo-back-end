import { Router } from 'express'
import * as wordsCtrl from '../controllers/words.js'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'

const router = Router()

// ========== Public Routes ===========
router.get('/wordLookup', wordsCtrl.getTranslations)


// ========= Protected Routes ========= 
router.use(decodeUserFromToken)

//localhost:3001/api/words
router.post('/', checkAuth, wordsCtrl.create)
router.get('/:wordId', checkAuth, wordsCtrl.show)
router.delete('/:wordId', checkAuth, wordsCtrl.delete)
router.get('/:userId/dictionary', checkAuth, wordsCtrl.index)  


export { router }