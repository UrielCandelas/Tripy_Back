import { Router } from 'express'

import { validateSchema } from '../middlewares/validator.middleware.js'
import { travelSchema } from '../schemas/travels.schemas.js'
import {
  registerNewTravel,
  getTravel,
  getAllTravels,
  addSecondUser,
  deleteSecondUser,
  deleteTravel,
  getMyTravel,
  getSharedTravel,
  getAllLocationTravels,
  getAllExtras,
  addTravelRequest,
  declineRequest,
  getTravelsI,
  getTravelsA,
} from '../controllers/travels.controller.js'

const router = Router()

// Viajes Generales
router.get('/travels', getAllTravels)
router.get('/travels/:id', getTravel)
router.get('/travels/shared/one/:id', getSharedTravel)
router.put('/travels/shared', addSecondUser)
router.put('/travels/secondShared/:id', deleteSecondUser)
router.get('/travels/location/:id', getAllLocationTravels)

router.get('/my-travels/:id', getMyTravel)
router.post('/my-travels', validateSchema(travelSchema), registerNewTravel)

router.delete('/travels/:id', deleteTravel)

router.get('/travels/extras/:id', getAllExtras)

router.post('/travels/requests/new',addTravelRequest)

router.put('/travels/requests/decline', declineRequest)

router.get('/travels/requested/inactive/:id', getTravelsI)

router.get('/travels/requested/active/:id', getTravelsA)

export default router
