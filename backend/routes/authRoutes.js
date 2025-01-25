import express from 'express'
import authControllers from '../controller/authController.js'
import { verifyToken } from '../middleware/verifyToken.js'

const router = express.Router()

const {logIn , logOut, signUp , verifyEmail ,forgotPassword , resetPassword ,authCheck} = authControllers

router.get('/auth-check' , verifyToken , authCheck )

router.post('/login',logIn)
router.post('/signup', signUp)
router.post('/logout',logOut)
router.post('/verify-email',verifyEmail)
router.post('/forgot-password', forgotPassword )
router.post('/reset-password/:token', resetPassword )




export default router