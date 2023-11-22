import Request from "../models/requests.model.js";
const joinTravel = async (socket) => {
  const userId = socket.handshake.query.id_user1
  socket.id = userId;
  /*if (userId == 0) {
    socket.disconnect();
    console.log("socket desconectado");
  }*/
  try {
    const requestValue = await Request.findAll({where:{id_user1: socket.id}})
    socket.emit("send_request", requestValue);
  } catch (error) {
    console.log(error)
  }
};
export default joinTravel;
