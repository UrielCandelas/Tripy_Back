//Se importa jwt
import jwt from 'jsonwebtoken';
//Se declara la llave secreta
const SECRET_KEY = process.env.SECRET_KEY

//Se exporta la constante
export const authRequired = (req,res,next) => {
    //Se obtiene el token de las cookies
    const { token } = req.cookies;

    if (!token) {
        //Si no hay token envia un estado 401
        return res.status(401).json({ message:"No autorizado" })
    }
    jwt.verify(token,SECRET_KEY,(err,decoded) => {
        if (err) {
            //Si el token expiro envia un estado 403
            return res.status(403).json({ message:"Token Invalido" })
        }
        //Se envia el usuario por medio de req.user
        req.user = decoded;
        
        next()
    })

    
}