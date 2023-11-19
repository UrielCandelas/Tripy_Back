import { Router } from 'express'
import { getAllTransports } from '../controllers/transports.controller.js'

const router = Router()

router.get('/transports', getAllTransports)

export default router
