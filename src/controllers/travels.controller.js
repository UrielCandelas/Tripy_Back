import Travel from "../models/travels.model.js";
import User from "../models/auth.model.js";
import Location from "../models/locations.model.js";
import Extra from "../models/extraComment.model.js";
import Expenses from "../models/expenses.model.js";
import Request from "../models/requests.model.js";

export const registerNewTravel = async (req, res) => {
  const {
    id_user1,
    id_location,
    travel_date,
    id_transportation,
    expense,
    quantity,
    extra,
    companions,
  } = req.body;
  let expenseSaved;
  let extraSaved;
  try {
    const getUser = await User.findByPk(id_user1);
    const getLocation = await Location.findByPk(id_location);
    if (!getLocation || !getUser) {
      console.log("asa")
      return res.status(400).json(["No se encontro el usuario o la ubicacion"]);
    }
    if (quantity) {
      const newExpense = Expenses.build({
        id_user1,
        expense,
        quantity,
      });
      expenseSaved = await newExpense.save();
    }
    if (extra) {
      const newExtra = Extra.build({
        extra_commentary: extra,
      });
      extraSaved = await newExtra.save();
    }
    const newTravel = Travel.build({
      id_user1,
      id_location,
      travel_date,
      id_transportation,
      id_expenses: expenseSaved ? expenseSaved.id : null,
      id_extras: extraSaved ? extraSaved.id : null,
      companions,
    });
    const travelSaved = await newTravel.save();
    const addID = await Expenses.update(
      {
        id_travel: travelSaved.id,
      },
      {
        where: {
          id: travelSaved.id_expenses,
        },
      }
    );
    res.status(200).json({
      id: travelSaved.id,
      id_user1: travelSaved.id_user1,
      id_location: travelSaved.id_location,
      travel_date: travelSaved.travel_date,
      id_transportation: travelSaved.id_transportation,
      id_expenses: travelSaved.id_expenses,
      id_extra: travelSaved.id_extras,
      companions: travelSaved.companions,
    });
  } catch (error) {
    res.status(500).json([`Ha ocurrido un error: ${error.message}`]);
  }
};
export const addSecondUser = async (req, res) => {
  const { id_user2, id_travel, id_request } = req.body;
  try {
    const travelFound = await Travel.findByPk(id_travel);
    const userFound = await User.findByPk(id_user2);
    const requestFound = await Request.findAll({
      where: { id_travel: id_travel, isActive: true },
    });

    if (!travelFound || !userFound) {
      res.status(400).json(["No se encontro el viaje o el usuario"]);
    }
    if (travelFound.dataValues.id_user2 != null) {
      return res
        .status(401)
        .json(["Ya se acepto la solicitud para este viaje"]);
    }

    const travelUpdated = await Travel.update(
      {
        id_user2,
      },
      {
        where: {
          id: id_travel,
        },
      }
    );
    const requestUpdated = await Request.update(
      {
        isActive: false,
      },
      {
        where: {
          id: id_request,
        },
      }
    );
    if (requestFound) {
      const unactiveRequest = await Request.update(
        {
          isActive: false,
        },
        {
          where: {
            id_travel: id_travel,
            isActive: true,
          },
        }
      );
    }
    const data = {
      travel: travelUpdated.dataValues,
      request: requestUpdated.dataValues,
    };

    res.status(200).json(data);
  } catch (error) {
    console.log(error.message);
    res.status(500).json([`Ha ocurrido un error: ${error.message}`]);
  }
};

export const editTravel = async (req, res) => {
  const {
    id_user1,
    id_user2,
    id_location,
    travel_date,
    transportation,
    expenses,
  } = req.body;
  const { id } = req.params;
  try {
    const getUser = await User.findByPk(id_user1);
    const getSecondUser = await User.findByPk(id_user2);
    const getLocation = await Location.findByPk(id_location);
    const travelFound = await Travel.findByPk(id);
    if (!getLocation || !getUser) {
      return res.status(400).json(["No se encontro el usuario o la ubicacion"]);
    }
    if (!getSecondUser) {
      return res.status(400).json(["No se encontro el usuario"]);
    }
    if (!travelFound) {
      return res.status(400).json(["No se encontro el viaje"]);
    }
    const travelUpdated = await Travel.update(
      {
        id_user1,
        id_user2,
        id_location,
        travel_date,
        transportation,
        expenses,
      },
      {
        where: {
          id,
        },
      }
    );
    res.status(200).json(travelUpdated);
  } catch (error) {
    res.status(500).json([`Ha ocurrido un error: ${error.message}`]);
  }
};

export const deleteSecondUser = async (req, res) => {
  const { id } = req.params;
  try {
    const travelFound = await Travel.findByPk(id);
    if (!travelFound) {
      res.status(400).json(["No se encontro el viaje"]);
    }
    const travelUpdated = await Travel.update(
      {
        id_user2: null,
      },
      {
        where: {
          id,
        },
      }
    );
    res.status(200).json(travelUpdated);
  } catch (error) {
    res.status(500).json([`Ha ocurrido un error: ${error.message}`]);
  }
};


export const deleteTravel = async (req, res) => {
  const { id } = req.params;
  try {
    const travelFound = await Travel.findByPk(id);
    if (!travelFound) {
      res.status(400).json(["No se encontro el viaje"]);
    }
    const travelUpdated = await Travel.update({
      isActive: false
    },{
      where:{
        id
      }
    })
    res.status(200).json(`Se ha eliminado el viaje`);
  } catch (error) {
    res.status(500).json([`Ha ocurrido un error: ${error.message}`]);
  }
};

export const getTravel = async (req, res) => {
  const { id } = req.params;
  try {
    const travelFound = await Travel.findByPk(id);
    if (!travelFound) {
      res.status(400).json(["No se encontro el viaje"]);
    }
    res.status(200).json(travelFound);
  } catch (error) {
    res.status(500).json([`Ha ocurrido un error: ${error.message}`]);
  }
};

export const getAllTravels = async (req, res) => {
  try {
    const travels = await Travel.findAll();
    res.status(200).json(travels);
  } catch (error) {
    res.status(500).json([`Ha ocurrido un error: ${error.message}`]);
  }
};

export const getMyTravel = async (req, res) => {
  const { id } = req.params;
  try {
    const travelFound = await Travel.findOne({ where: { id_user1: id } });
    if (!travelFound) {
      res.status(400).json(["No se encontro el viaje"]);
    }
    res.status(200).json(travelFound);
  } catch (error) {
    res.status(500).json([`Ha ocurrido un error: ${error.message}`]);
  }
};

export const getSharedTravel = async (req, res) => {
  const { id } = req.params;
  try {
    const travelFound = await Travel.findOne(id);
    if (!travelFound) {
      res.status(400).json(["No se encontro el viaje"]);
    }
    res.status(200).json(travelFound);
  } catch (error) {
    res.status(500).json([`Ha ocurrido un error: ${error.message}`]);
  }
};

export const getAllLocationTravels = async (req, res) => {
  const { id } = req.params;
  try {
    const travels = await Travel.findAll({ where: { id_location: id } });
    res.status(200).json(travels);
  } catch (error) {
    return res.status(500).json([`Ha ocurrido un error: ${error.message}`]);
  }
};

export const getAllExtras = async (req, res) => {
  const { id } = req.params;
  try {
    const extras = await Extra.findOne({ where: { id } });
    res.status(200).json(extras);
  } catch (error) {
    res.status(500).json([`Ha ocurrido un error: ${error.message}`]);
  }
};

export const addTravelRequest = async (req, res) => {
  const { id_user1, id_user2, id_travel } = req.body;
  try {
    const travelFound = await Travel.findByPk(id_travel);
    const user1Found = await User.findByPk(id_user1);
    const user2Found = await User.findByPk(id_user2);
    if (!user1Found) {
      //console.log("a")
      return res.status(404).json(["No se encontro al usuario"]);
    }
    if (!user2Found) {
      //console.log("b")
      return res.status(404).json(["Tu usuario no existe"]);
    }
    if (!travelFound) {
      //console.log("c")
      return res.status(404).json(["No se encontro el viaje"]);
    }
    const requestFound = await Request.findOne({
      where: { id_user2: id_user2, id_travel: id_travel, isActive: true },
    });
    if (requestFound) {
      console.log("paso aqui");
      return res.status(401).json(["Ya tienes una solicitud pendiente"]);
    }

    const newRequest = Request.build({
      id_user1,
      id_user2,
      id_travel,
    });
    const requestSaved = await newRequest.save();
    res.status(200).json(requestSaved);
  } catch (error) {
    res.status(500).json([`Ha ocurrido un error: ${error.message}`]);
  }
};

export const declineRequest = async (req, res) => {
  const { id_request } = req.body;
  try {
    const requestFound = await Request.findByPk(id_request);
    if (!requestFound) {
      return res.status(404).json(["No se encontro la solicitud"]);
    }
    const requestUpdated = await Request.update(
      {
        isActive: false,
      },
      {
        where: {
          id: id_request,
        },
      }
    );
    res.status(200).json(requestUpdated);
  } catch (error) {
    res.status(500).json([`Ha ocurrido un error: ${error.message}`]);
  }
};

export const getTravelsI = async (req, res) => {
  const { id } = req.params;
  const myTravels = [];
  const sharedTravels = [];
  const expenses = [];
  const locations = [];
  const extras = [];
  try {
    const travelsFoundUser1 = await Travel.findAll({
      where: {
        id_user1: id,
        isActive: false,
      },
    });
    const travelsFoundUser2 = await Travel.findAll({
      where: {
        id_user2: id,
        isActive: false,
      },
    });
    if (!travelsFoundUser1 && !travelsFoundUser2) {
      res.status(200).json(["No hay viajes"]);
      const data = {
        travels: myTravels,
        sharedTravels: sharedTravels,
      };
      res.status(200).json(data);
    }
    for (let index = 0; index < travelsFoundUser1.length; index++) {
      if (travelsFoundUser1[index]) {
        const expensesFound = await Expenses.findOne({
          where: { id: travelsFoundUser1[index].id_expenses },
        });
        expenses.push(expensesFound);
        const locationFound = await Location.findByPk(
          travelsFoundUser1[index].dataValues.id_location
        );
        locations.push(locationFound.dataValues);
        const extrasFound = await Extra.findByPk(travelsFoundUser1[index].dataValues.id_extras)
        if (extrasFound) {
          extras.push(extrasFound.dataValues);
        }
        
      }
    }
    const data = {
      travels: travelsFoundUser1,
      sharedTravels: travelsFoundUser2,
      locations: locations,
      expenses: expenses,
      extras: extras,
    }
    res.status(200).json(data);
  } catch (error) {
    console.log(error)
    res.status(500).json([`Ha ocurrido un error: ${error.message}`]);
  }
};
export const getTravelsA = async (req, res) => {
  const { id } = req.params;
  const myTravels = [];
  const sharedTravels = [];
  const expenses1 = [];
  const locations1 = [];
  const extras1 = [];
  const expenses2 = [];
  const locations2 = [];
  const extras2 = [];
  try {
    const travelsFoundUser1 = await Travel.findAll({
      where: {
        id_user1: id,
        isActive: true,
      },
    });
    const travelsFoundUser2 = await Travel.findAll({
      where: {
        id_user2: id,
        isActive: true,
      },
    });
    if (!travelsFoundUser1 && !travelsFoundUser2) {
      res.status(200).json(["No hay viajes"]);
      const data = {
        travels: myTravels,
        sharedTravels: sharedTravels,
      };
      res.status(200).json(data);
    }
    for (let index = 0; index < travelsFoundUser1.length; index++) {
      if (travelsFoundUser1[index]) {
        const expensesFound = await Expenses.findOne({
          where: { id: travelsFoundUser1[index].id_expenses },
        });
        expenses1.push(expensesFound);
        const locationFound = await Location.findByPk(
          travelsFoundUser1[index].dataValues.id_location
        );
        locations1.push(locationFound.dataValues);
        const extrasFound = await Extra.findByPk(travelsFoundUser1[index].dataValues.id_extras)
        if (extrasFound) {
          extras1.push(extrasFound.dataValues);
        }
        
      }
    }
    for (let index = 0; index < travelsFoundUser2.length; index++) {
      if (travelsFoundUser2[index]) {
        const expensesFound = await Expenses.findOne({
          where: { id: travelsFoundUser2[index].id_expenses },
        });
        expenses2.push(expensesFound);
        const locationFound = await Location.findByPk(
          travelsFoundUser2[index].dataValues.id_location
        );
        locations2.push(locationFound.dataValues);
        const extrasFound = await Extra.findByPk(travelsFoundUser2[index].dataValues.id_extras)
        if (extrasFound) {
          extras2.push(extrasFound.dataValues);
        }
        
      }
    }
    const data = {
      travels: travelsFoundUser1,
      sharedTravels: travelsFoundUser2,
      locations_user1: locations1,
      expenses_user1: expenses1,
      extras_user1: extras1,
      locations_user2: locations2,
      expenses_user2: expenses2,
      extras_user2: extras2,
    };
    res.status(200).json(data);
  } catch (error) {
    console.log(error)
    res.status(500).json([`Ha ocurrido un error: ${error.message}`]);
  }
};
