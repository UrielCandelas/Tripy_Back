import { Router } from 'express'

import { validateSchema } from '../middlewares/validator.middleware.js'
import { travelSchema } from '../schemas/travels.schemas.js'
import {
  registerNewTravel,
  getTravel,
  getAllTravels,
  addSecondUser,
  editTravel,
  deleteSecondUser,
  getMyTravels,
  getSharedTravels,
  deleteTravel,
  getMyTravel,
  getSharedTravel,
  getAllLocationTravels,
  getAllExtras,
  addTravelRequest
} from '../controllers/travels.controller.js'

const router = Router()

// Viajes Generales
router.get('/travels', getAllTravels)
router.get('/travels/:id', getTravel)
router.get('/travels/shared/:id', getSharedTravels)
router.get('/travels/shared/one/:id', getSharedTravel)
router.put('/travels/shared/:id', addSecondUser)
router.put('/travels/secondShared/:id', deleteSecondUser)
router.get('/travels/location/:id', getAllLocationTravels)

// Mis Viajes
router.get('/my-travels/', getMyTravels)
router.get('/my-travels/:id', getMyTravel)
router.post('/my-travels', validateSchema(travelSchema), registerNewTravel)
router.put('/my-travels/:id', validateSchema(travelSchema), editTravel)
router.delete('/my-travels/:id', deleteTravel)

router.get('/travels/extras/:id', getAllExtras)

router.post('/travels/requests/new',addTravelRequest)

export default router
