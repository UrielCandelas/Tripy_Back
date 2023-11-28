//Se importa las variables del entorno
import "dotenv/config";

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
import travelRoutes from "./routes/travels.routes.js"
import transportsRoutes from "./routes/transports.routes.js"
import usersRoutes from "./routes/users.routes.js"
import expensesRoutes from "./routes/expenses.routes.js"

import joinTravel from "./connections/joinTravel.connection.js"
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

io.on("connection", joinTravel);



//Se exporta la constante
export default httpServer;
