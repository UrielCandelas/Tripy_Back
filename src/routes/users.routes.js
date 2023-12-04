import { Router } from "express";

import {
  getUserById,
  getUsersByRequest,
  registerNewCommentary,
  getComentariesByID,
  getContacts,
  registerNewMessage,
  getMessages,
} from "../controllers/users.controller.js";

import { commentarySchema } from "../schemas/commentary.schema.js";
import { validateSchema } from "../middlewares/validator.middleware.js";

const router = Router();

router.get("/user/:id", getUserById);

router.get("/user/request/:id", getUsersByRequest);

router.post(
  "/user/commentary",
  registerNewCommentary
);

router.get("/user/commentary/all-commentaries/:id",getComentariesByID);

router.get("/user/contacts/:id",getContacts);

router.post("/user/message", registerNewMessage);

router.get("/user/messages", getMessages);


export default router;
