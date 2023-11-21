import { Router } from "express";

import { getUserById } from "../controllers/users.controller.js";

const router = Router()

router.get('/user/:id', getUserById)

export default router;