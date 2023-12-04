//Se importa las variables del entorno
import "dotenv/config";

//import connection from "./connections/connection.js";

//Se importan los modulos del sistema
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { createServer } from "node:http";
import { Server } from "socket.io";
//Se importan los modulos del sistema
import authRoutes from "./routes/auth.routes.js";
import locationRoutes from "./routes/locations.routes.js";
import travelRoutes from "./routes/travels.routes.js";
import transportsRoutes from "./routes/transports.routes.js";
import usersRoutes from "./routes/users.routes.js";
import expensesRoutes from "./routes/expenses.routes.js";

//Se crea una constante de express
const app = express();
const origin = process.env.ORIGIN_URL;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: origin,
    credentials: true,
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

global.onlineUsers = new Map();

io.on("connection", async (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
  const arrRequest = [];
  const arrTravels = [];
  const arrLocations = [];
  const arrUsers = [];

  socket.on("get_requests", async (data) => {
    const id_user1 = data.id_user1;
    try {
      const requestValue = await Request.findAll({
        where: { id_user1: id_user1 },
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
    } catch (error) {
      console.log(error);
    }
  });
});

//Se exporta la constante
export default httpServer;
