import Locations from "../models/locations.model.js";
import Travel from "../models/travels.model.js";

export const registerLocation = async (req, res) => {
  const { location_name, location, description, cost, schedule } = req.body;
  try{
    
    const newLocation = Locations.build({
      location_name,
      location,
      description,
      cost,
      schedule,
    });
    const locationSaved = await newLocation.save();
    res.status(200).json({
      id: locationSaved.id,
      locName: locationSaved.location_name,
      location: locationSaved.location,
      description: locationSaved.description,
      cost: locationSaved.cost,
      schedule: locationSaved.schedule,
    });
  } catch (error) {
    return res.status(500).json([`Ha ocurrido un error: ${error}`]);
  }
};

export const editLocation = async (req, res) => {
  const { location_name, location, description, cost, schedule } = req.body;
  const id = req.params.id;
  try {
    const locationFound = await Locations.findByPk(id);
    if (!locationFound) {
      return res.status(400).json(["No esta registrada la ubicacion"]);
    }
    const editedLocation = await Locations.update(
      {
        location_name,
        location,
        description,
        cost,
        schedule,
      },
      { where: { id: locationFound.id } }
    );
    res.status(200).json(editedLocation);
  } catch (error) {
    return res.status(500).json([`Ha ocurrido un error: ${error.message}`]);
  }
};

export const getAllLocations = async (req,res)=>{
    try {
        const locationsFound = await Locations.findAll()
        res.status(200).json(locationsFound)
    } catch (error) {
        res.status(500).json([`Ocurrio un Error: ${error.message}`])
    }
}

export const getLocation = async (req,res)=>{
    const id = req.params.id
    try {
        const locationFound = await Locations.findByPk(id)
        if (!locationFound) {
          return res.status(400).json(["No esta registrada la ubicacion"]);
        }
        res.status(200).json(locationFound)
    } catch (error) {
        res.status(500).json([`Ocurrio un Error: ${error.message}`])
    }
}

export const deleteLocation = async (req,res)=>{
    const id = req.params.id
    try {
        const locationFound = await Locations.findByPk(id)
        if (!locationFound) {
          return res.status(400).json(["No esta registrada la ubicacion"]);
        }
        await locationFound.destroy()
        res.status(200).json(['Se ha eliminado el registro'])
    } catch (error) {
        res.status(500).json([`Ocurrio un Error: ${error.message}`])
    }
}

export const getLocationByTravel = async (req,res)=>{
    const data = req.body;
    const arr1 = [];
    const arr2 = []
    try {
      for (let index = 0; index < data.length; index++) {
        const travelFound = await Travel.findByPk(data[i].id_travel)
        const idLoc = travelFound.dataValues.id_location
        const locationFound = await Locations.findByPk(idLoc)
        arr1.push(locationFound)
      }
      res.status(200).json(locationFound)
    } catch (error) {
        res.status(500).json([`Ocurrio un Error: ${error.message}`])
    }
}