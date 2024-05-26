import express from 'express'
import { createListing, deleteProperty, updateProperty, getProperty, getSearchProperty } from '../controllers/listingController.js'
import { verifyToken } from '../utils/UserVerify.js'

const router = express.Router()


router.post('/create', createListing)
router.delete('/delete/:id', deleteProperty)
router.post('/update/:id', updateProperty)
router.get('/get/:id', getProperty)
router.get('/get', getSearchProperty)

export default router;


