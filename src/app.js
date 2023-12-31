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
//const origin = process.env.ORIGIN_URL;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

const allowedOrigins = [
  "http://localhost:5173",
  "exp://192.168.0.10:8081",
  "http://localhost:19006"
]
//Se usan los modulos que importamos
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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

  socket.on("send-requests", (data)=>{
    const sendUserSocket = onlineUsers.get(data.id);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("get-requests", data.req);
    }
  })
  
});

//Se exporta la constante
export default httpServer;
