import { Router } from 'express';

import {validateSchema} from '../middlewares/validator.middleware.js'
import { locationSchema } from '../schemas/locations.schemas.js';
import { registerLocation,editLocation,getLocation,deleteLocation,getAllLocations,getLocationByTravel} from '../controllers/locations.controller.js';

const router = Router()

router.post("/locations",validateSchema(locationSchema),registerLocation)
router.put("/locations/:id",validateSchema(locationSchema),editLocation)
router.get("/locations/:id",getLocation)
router.delete("/locations/:id",deleteLocation)
router.get("/locations",getAllLocations)
router.get("/locations/travel",getLocationByTravel)


export default router
