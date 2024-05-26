import express from 'express'
import { register, login, google, logout } from '../controllers/authController.js'


const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.post('/google', google);

export default router