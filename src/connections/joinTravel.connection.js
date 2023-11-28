import Request from "../models/requests.model.js";
import Travel from "../models/travels.model.js";
import Location from "../models/locations.model.js";
import User from "../models/auth.model.js";
const joinTravel = async (socket) => {
  const userId = socket.handshake.query.id;
  socket.id = userId
  const arrRequest = [];
  const arrTravels = [];
  const arrLocations = [];
  const arrUsers = [];
  if (userId == 0) {
    socket.disconnect();
    return;
  }
  try {
    const requestValue = await Request.findAll({
      where: { id_user1: userId },
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

      const requestUser = await User.findByPk(requestValue[index].dataValues.id_user2);
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
};
export default joinTravel;
