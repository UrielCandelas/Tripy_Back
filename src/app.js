//Se importa las variables del entorno
import "dotenv/config";

import Request from "./models/requests.model.js";
import Travel from "./models/travels.model.js";
import Location from "./models/locations.model.js";
import User from "./models/auth.model.js";
import Chat from "./models/chat.model.js";

//Se importan los modulos del sistema
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { createServer } from "http";
import { Server } from "socket.io";
//Se importan los modulos del sistema
import authRoutes from "./routes/auth.routes.js";
import locationRoutes from "./routes/locations.routes.js";
import travelRoutes from "./routes/travels.routes.js";
import transportsRoutes from "./routes/transports.routes.js";
import usersRoutes from "./routes/users.routes.js";
import expensesRoutes from "./routes/expenses.routes.js";

import joinTravel from "./connections/joinTravel.connection.js";
//Se crea una constante de express
const app = express();
const origin = process.env.ORIGIN_URL;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

//Se usan los modulos que importamos
app.use(
  cors({
    origin: origin,
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

//Se usan los modulos de la app
app.use("/api", authRoutes);
app.use("/api", locationRoutes);
app.use("/api", travelRoutes);
app.use("/api", transportsRoutes);
app.use("/api", usersRoutes);
app.use("/api", expensesRoutes);

io.on("connection", async (socket) => {
  const userId = socket.handshake.query.id;
  socket.id = userId;
  socket.room = 0;
  const arrRequest = [];
  const arrTravels = [];
  const arrLocations = [];
  const arrUsers = [];
  const arrChatMessages = [];
  const contacts = [];
  let helpArray = [];
  const arrUserInChat = [];
  if (userId == 0) {
    socket.disconnect();
    return;
  }
  try {
    const requestValue = await Request.findAll({
      where: { id_user1: socket.id },
    });

    for (let index = 0; index < requestValue.length; index++) {
      arrRequest.push(requestValue[index].dataValues);
      //console.log(requestValue[index].dataValues.id_travel)
      const requestTravel = await Travel.findByPk(
        requestValue[index].dataValues.id_travel
      );
      arrTravels.push(requestTravel.dataValues);

      const requestLocation = await Location.findByPk(
        requestTravel.dataValues.id_location
      );
      arrLocations.push(requestLocation.dataValues);

      const requestUser = await User.findByPk(
        requestValue[index].dataValues.id_user2
      );
      arrUsers.push(requestUser.dataValues);
    }
    const objData = {
      request: arrRequest,
      travels: arrTravels,
      locations: arrLocations,
      users: arrUsers,
    };
    socket.emit("send_request", objData);

    //obtener contactos
    const travelFoundU1 = await Travel.findAll({
      where: { id_user1: socket.id },
    });
    const travelFoundU2 = await Travel.findAll({
      where: { id_user2: socket.id },
    });
    for (let index = 0; index < travelFoundU1.length; index++) {
      if (travelFoundU1[index]) {
        const userFound = await User.findByPk(travelFoundU1[index].id_user2);
        if (userFound) {
          const dataContactsU1 = {
            id: userFound.dataValues.id,
            name: userFound.dataValues.name,
            userName: userFound.dataValues.userName,
            lastName: userFound.dataValues.lastName,
            email: userFound.dataValues.email,
          };
          contacts.push(dataContactsU1);
        }
      }
    }
    for (let index = 0; index < travelFoundU2.length; index++) {
      if (travelFoundU2[index]) {
        const userFound = await User.findByPk(travelFoundU2[index].id_user1);
        if (userFound) {
          const dataContactsU2 = {
            id: userFound.dataValues.id,
            name: userFound.dataValues.name,
            userName: userFound.dataValues.userName,
            lastName: userFound.dataValues.lastName,
            email: userFound.dataValues.email,
          };
          contacts.push(dataContactsU2);
        }
      }
    }
    helpArray = contacts;
    for (let index = 0; index < helpArray.length; index++) {
      if (helpArray[index].id == contacts[index].id) {
        contacts.splice(index, 1);
      }
    }
    socket.emit("send_contacts", contacts);

    //enviar mensajes
    socket.on("joinRoom", async (data) => {
      socket.join(data.room);
      socket.room = data.room;
      console.log(socket.room)
    });

    socket.on("sendMessage", async (data) => {
      console.log("llega el mensaje");
      try {
        console.log(data.message);
        arrChatMessages.push(data.message);
        socket.to(data.room).emit("receive_message", data.message);
      } catch (error) {
        console.log(error);
      }
    });
  } catch (error) {
    console.log(error);
  }
});

//Se exporta la constante
export default httpServer;
