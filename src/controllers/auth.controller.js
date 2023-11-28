//Se importan los modulos a ocupar
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//Se importan los modelos
import User from "../models/auth.model.js";

//Se importan las librerias
import { createAccessToken } from "../libs/jwt.lib.js";

//Se declara la llave secreta
const SECRET_KEY = process.env.SECRET_KEY;

//Se crea el registro de un nuevo usuario
export const register = async (req, res) => {
  //Se obtienen un nombre un email y una contraseña del json de consulta
  const { name, lastName, secondLastName, userName, email, password, isAdmin } =
    req.body;
  try {
    //Se busca el usuario por su correo
    const userFound = await User.findOne({ where: { email } });
    const userNameFound = await User.findOne({ where: { userName } });
    if (userFound) {
      //Si se encuentra se regresa un estatus 400 de error
      return res
        .status(400)
        .json(["Ese correo ha sido anteriormente registrado"]);
    }
    if (userNameFound) {
      //Si se encuentra se regresa un estatus 400 de error
      return res
        .status(400)
        .json(["Ese nombre de usuario ha sido anteriormente registrado"]);
    }
    //Se encripta la contraseña
    const hash = await bcrypt.hash(password, 12);

    //Se crea un nuevo usuario con los datos
    const newUser = User.build({
      name,
      lastName,
      secondLastName,
      userName,
      email,
      password: hash,
      isAdmin,
    });
    //Se guarda el usuario en la base de datos
    const userSaved = await newUser.save();
    //Se crea un token con el id del usuario creado
    const token = await createAccessToken({ id: userSaved.id });

    //Se Crea una cookie con el token con el id
    res.cookie("token", token);
    //Se envia un json con todos los datos del usuario
    res.json({
      id: userSaved.id,
      name: userSaved.name,
      lastName: userSaved.lastName,
      secondLastName: userSaved.secondLastName,
      userName: userSaved.userName,
      email: userSaved.email,
      isAdmin: userSaved.isAdmin,
      token: token
    });
  } catch (error) {
    //Se envia un estatus 500 en caso de que falle el servidor
    res.status(500).json([error.message]);
  }
};

//Se crea el login del usuario
export const login = async (req, res) => {
  //Se obtiene el email y la contraseña de la peticion
  const { email, password } = req.body;

  try {
    //Se busca si ya existe el usuario
    const userFound = await User.findOne({ where: { email: email } });

    if (!userFound) {
      //Si no existe se envia un estatus 404 de que no se ha encontrado el usuario
      return res.status(404).json(["Usuario no encontrado"]);
    }
    //Se compara la contraseña obtenida con la guardada en la base de datos
    const isMatch = await bcrypt.compare(password, userFound.password);

    if (!isMatch) {
      //Si no coinciden se envia un estatus 400
      return res.status(400).json(["Contraseña incorrecta"]);
    }
    //Se crea un token con el id del usuario
    const token = await createAccessToken({ id: userFound.id });
    //Se crea una cookie con el token
    res.cookie("token", token);
    //Se envia un json con todos los datos del usuario
    res.json({
      id: userFound.id,
      name: userFound.name,
      lastName: userFound.lastName,
      secondLastName: userFound.secondLastName,
      userName: userFound.userName,
      email: userFound.email,
      isAdmin: userFound.isAdmin,
      token: token,
    });
  } catch (error) {
    //Se envia un estatus 500 en caso de que falle el servidor
    res.status(500).json([error.message]);
  }
};

//Se crea el logout
export const logout = (req, res) => {
  //Reescribe el token y tiene un tiempo de vida de 0 segundos
  res.cookie("token", "", {
    expires: new Date(0),
  });
  //Se regresa un estatus 200 de que se ha invalidado la cookie
  return res.sendStatus(200);
};

//Se crea una funcion para obtener el perfil del usuario
export const profile = async (req, res) => {
  //Se obtiene el usuario del token verificado en auth.routes.js
  const userFound = await User.findByPk(req.user.id);
  if (!userFound) {
    //Si no hay algun usuario entonces envia un estatus 404
    return res.status(404).json(["Usuario no encontrado"]);
  }
  //Envia todos los datos del usuario
  return res.json({
    id: userFound.id,
    name: userFound.name,
    lastName: userFound.lastName,
    secondLastName: userFound.secondLastName,
    userName: userFound.userName,
    email: userFound.email,
    isAdmin: userFound.isAdmin,
    createdAt: userFound.createdAt,
  });
};

//Se crea una funcion para verificar el token que se ingrese
export const verifyToken = async (req, res) => {
  //Se obtiene el token de la cookie
  const { token } = req.cookies;
  if (!token) {
    //Si no hay token entonces envia un estatus 401
    return res.status(401).json(["No autorizado"]);
  }
  jwt.verify(token, SECRET_KEY, async (err, user) => {
    if (err) {
      //Si el token no es valido entonces envia un estatus 401
      return res.status(401).json(["No autorizado"]);
    }
    const userFound = await User.findByPk(user.id);
    if (!userFound) {
      console.log("aca llega")
      //Si el usuario del token no existe entonces envia un estatus 404
      return res.status(404).json(["No autorizado"]);
    }
    //Envia el usuario encontrado
    return res.json({
      id: userFound.id,
      name: userFound.name,
      lastName: userFound.lastName,
      secondLastName: userFound.secondLastName,
      userName: userFound.userName,
      email: userFound.email,
      isAdmin: userFound.isAdmin,
    });
  });
};

export const verifyTokenMovil = async (req, res) => {
  //Se obtiene el token de la cookie
  const { token } = req.body;
  if (!token) {
    //Si no hay token entonces envia un estatus 401
    return res.status(401).json(["No autorizado"]);
  }
  jwt.verify(token, SECRET_KEY, async (err, user) => {
    if (err) {
      //Si el token no es valido entonces envia un estatus 401
      return res.status(401).json(["No autorizado"]);
    }
    const userFound = await User.findByPk(user.id);
    if (!userFound) {
      //Si el usuario del token no existe entonces envia un estatus 404
      return res.status(404).json(["No autorizado"]);
    }
    //Envia el usuario encontrado
    return res.json({
      id: userFound.id,
      name: userFound.name,
      lastName: userFound.lastName,
      secondLastName: userFound.secondLastName,
      userName: userFound.userName,
      email: userFound.email,
      isAdmin: userFound.isAdmin,
    });
  });
};

export const editUserAcount = async (req, res) => {
  const {email,newEmail,password,newPassword,userName,id} = req.body;
  try {
    const userFound = await User.findOne({ where: { email } });
    if (!userFound) {
      return res.status(404).json(["Usuario no encontrado"]);
    }
    const compare = await bcrypt.compare(password, userFound.password);
    if (compare == false) {
      return res.status(400).json(["Contraseña incorrecta"]);
    }
    const hash = await bcrypt.hash(newPassword, 12);
    const userUpdated = await User.update({
      userName,
      email: newEmail,
      password: hash,
    },{
      where:{
        id
      }
    })
    res.status(200).json({
      id: userUpdated.id,
      name: userUpdated.name,
      lastName: userUpdated.lastName,
      secondLastName: userUpdated.secondLastName,
      userName: userUpdated.userName,
      email: userUpdated.email,
      isAdmin: userUpdated.isAdmin,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json([error.message]);
  }
}
