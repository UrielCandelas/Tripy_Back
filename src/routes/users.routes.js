import { Router } from "express";

import {
  getUserById,
  getUsersByRequest,
  registerNewCommentary,
  getComentariesByID,
} from "../controllers/users.controller.js";

import { commentarySchema } from "../schemas/commentary.schema.js";
import { validateSchema } from "../middlewares/validator.middleware.js";

const router = Router();

router.get("/user/:id", getUserById);
router.get("/user/request/:id", getUsersByRequest);
router.post(
  "/user/commentary",
  validateSchema(commentarySchema),
  registerNewCommentary
);
router.get("/user/commentary/all-commentaries/:id",getComentariesByID);


export default router;
