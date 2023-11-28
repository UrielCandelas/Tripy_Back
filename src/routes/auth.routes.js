//Se importa Router desde express
import { Router } from "express";
//Se importan todas las funciones desde controllers
import { register,login,logout,profile,verifyToken, verifyTokenMovil,editUserAcount } from "../controllers/auth.controller.js"
//Se importan los middlewares
import { authRequired } from "../middlewares/validateToken.middleware.js"
import { validateSchema } from "../middlewares/validator.middleware.js";
//Se importan los esquemas del registro y del login
import { registerSchema,loginSchema} from "../schemas/auth.schemas.js"

//Se crea una constante de router
const router = Router()

//Se crea un nuevo usuario y se valida que el esquema se cumpla
router.post('/register',validateSchema(registerSchema), register);
//Se loguea el usuarioy se valida que el esquema se cumpla
router.post('/login',validateSchema(loginSchema), login);
//Se desloguea el usuario
router.post('/logout', logout);
//Se obtiene el perfil del usuario sin antes verificar que ya este logueado 

//Se verifica si el token es valido
router.post('/auth/verify', verifyToken)

router.post('/auth/verifyMobile', verifyTokenMovil)

router.put('/auth/edit-acount', editUserAcount)


//Exporta router y todos sus metodos
export default router