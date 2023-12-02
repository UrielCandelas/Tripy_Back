import Request from "../models/requests.model.js";
import Travel from "../models/travels.model.js";
import Location from "../models/locations.model.js";
import User from "../models/auth.model.js";
import Chat from "../models/chat.model.js";
import { Op } from "sequelize";
const connection = async (socket) => {
  console.log("user connected");
  const arrRequest = [];
  const arrTravels = [];
  const arrLocations = [];
  const arrUsers = [];
  const arrChatMessages = [];
  const contacts = [];
  let helpArray = [];

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("get_messages", async (data) => {
    if (!socket.recovered) {
      try {
        const res = await Chat.findAll({
          where: { id: { [Op.gt]: socket.handshake.auth.serverOffset }, id_user1: data.id_user, id_user2: data.id_user2 },
        });
        res.map((message , i)=>{
          socket.emit("message", message.message);
        })
      } catch (error) {
        console.log(error)
      }
    }
  })

  socket.on("get_request", async (data) => {
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
  socket.on("get_contacts", async (data) => {
    const travelFoundU1 = await Travel.findAll({
      where: { id_user1: data.id_user },
    });
    const travelFoundU2 = await Travel.findAll({
      where: { id_user2: data.id_user },
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
  });
  socket.on("joinRoom", async (data) => {
    socket.join(data.room);
    socket.room = data.room;
  });

  socket.on("send_message", async (data) => {
    try {
      console.log(data.message);
      const newMessage = Chat.build({
        id_user1: data.id_user1,
        id_user2: data.id_user2,
        id_travel: data.id_travel,
        message: data.message,
      })
      const messageSaved = await res.save();
      socket.to(data.room).emit("receive_message", messageSaved.message);
    } catch (error) {
      console.log(error);
    }
  });
};
export default connection;
