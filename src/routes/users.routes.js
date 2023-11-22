import { Router } from "express";

import { getUserById,getUsersByRequest } from "../controllers/users.controller.js";

const router = Router()

router.get('/user/:id', getUserById)
router.get('/user/request/:id', getUsersByRequest)

export default router;