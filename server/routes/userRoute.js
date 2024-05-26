import express from 'express'
import { verifyToken } from '../utils/UserVerify.js'

import { test, updateUser, deleteUser, getUserProperty } from '../controllers/userController.js'


const router = express.Router()

router.get('/test', test)
router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
router.get('/listings/:id', getUserProperty)

export default router