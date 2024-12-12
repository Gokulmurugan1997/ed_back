import express from 'express'
import userRouter from './user.js'
let router = express.Router()

router.use('/ed', userRouter)

export default router