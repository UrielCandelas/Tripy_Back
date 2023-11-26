//Se importa jwt
import jwt from 'jsonwebtoken';

//Se declara la llave de desencriptacion
const SECRET_KEY = process.env.SECRET_KEY

//Se crea el token con los datos que van a ser enviados
export function createAccessToken(payload) {
  return new Promise((resolve,reject)=>{
    jwt.sign(
        payload,
        SECRET_KEY,
        {
          expiresIn: "1week",
        },
        (err, token) => {
          if (err) reject(err);
          resolve(token);
        }
      );
  })
}
