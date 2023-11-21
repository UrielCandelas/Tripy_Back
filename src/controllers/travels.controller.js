import Travel from '../models/travels.model.js'
import User from '../models/auth.model.js'
import Location from '../models/locations.model.js'
import Extra from '../models/extraComment.model.js'
import Expenses from '../models/expenses.model.js'

export const registerNewTravel = async (req, res) => {
  const { id_user1, id_location, travel_date, id_transportation,expense, quantity, extra, companions} =
    req.body
    let expenseSaved;
    let extraSaved;
  try {
    const getUser = await User.findByPk(id_user1)
    const getLocation = await Location.findByPk(id_location)
    if (!getLocation || !getUser) {
      return res.status(400).json(['No se encontro el usuario o la ubicacion'])
    }
    if (quantity) {
      const newExpense = Expenses.build({
        id_user1,
        expense,
        quantity
      })
       expenseSaved = await newExpense.save()
    }
    if (extra) {
      const newExtra = Extra.build({
        extra_commentary: extra
      })
       extraSaved = await newExtra.save()
    }
    const newTravel = Travel.build({
      id_user1,
      id_location,
      travel_date,
      id_transportation,
      id_expenses: expenseSaved ? expenseSaved.id : null,
      id_extras: extraSaved ? extraSaved.id : null,
      companions,
    })
    const travelSaved = await newTravel.save()
    const addID = await Expenses.update(
      {
        id_travel: travelSaved.id,
      },
      {
        where: {
          id: travelSaved.id_expenses,
        },
      }
    )
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
    res.status(500).json([`Ha ocurrido un error: ${error.message}`])
  }
}
export const addSecondUser = async (req, res) => {
  const { id } = req.params
  const { id_user2 } = req.body
  try {
    const travelFound = await Travel.findByPk(id)
    const userFound = await User.findByPk(id_user2)
    if (!travelFound || !userFound) {
      res.status(400).json(['No se encontro el viaje o el usuario'])
    }
    const travelUpdated = await Travel.update(
      {
        id_user2,
      },
      {
        where: {
          id,
        },
      }
    )
    res.status(200).json(travelUpdated)
  } catch (error) {
    res.status(500).json([`Ha ocurrido un error: ${error.message}`])
  }
}

export const editTravel = async (req, res) => {
  const {
    id_user1,
    id_user2,
    id_location,
    travel_date,
    transportation,
    expenses,
  } = req.body
  const { id } = req.params
  try {
    const getUser = await User.findByPk(id_user1)
    const getSecondUser = await User.findByPk(id_user2)
    const getLocation = await Location.findByPk(id_location)
    const travelFound = await Travel.findByPk(id)
    if (!getLocation || !getUser) {
      return res.status(400).json(['No se encontro el usuario o la ubicacion'])
    }
    if (!getSecondUser) {
      return res.status(400).json(['No se encontro el usuario'])
    }
    if (!travelFound) {
      return res.status(400).json(['No se encontro el viaje'])
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
    )
    res.status(200).json(travelUpdated)
  } catch (error) {
    res.status(500).json([`Ha ocurrido un error: ${error.message}`])
  }
}

export const deleteSecondUser = async (req, res) => {
  const { id } = req.params
  try {
    const travelFound = await Travel.findByPk(id)
    if (!travelFound) {
      res.status(400).json(['No se encontro el viaje'])
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
    )
    res.status(200).json(travelUpdated)
  } catch (error) {
    res.status(500).json([`Ha ocurrido un error: ${error.message}`])
  }
}

export const getMyTravels = async (req, res) => {
  const { id } = req.params
  try {
    const user1Travels = Travel.findAll({ where: { id_user1: id } })
    if (!user1Travels) {
      res.status(200).json('El usuario no tiene viajes')
    }
    res.status(200).json(user1Travels)
  } catch (error) {
    res.status(500).json([`Ha ocurrido un error: ${error.message}`])
  }
}
export const getSharedTravels = async (req, res) => {
  const { id } = req.params
  try {
    const user2Travels = Travel.findAll({ where: { id_user2: id } })
    if (!user2Travels) {
      res.status(200).json('El usuario no tiene viajes compartidos')
    }
    res.status(200).json(user2Travels)
  } catch (error) {
    res.status(500).json([`Ha ocurrido un error: ${error.message}`])
  }
}

export const deleteTravel = async (req, res) => {
  const { id } = req.params
  try {
    const travelFound = await Travel.findByPk(id)
    if (!travelFound) {
      res.status(400).json(['No se encontro el viaje'])
    }
    await travelFound.destroy()
    res.status(200).json(`Se ha eliminado el viaje`)
  } catch (error) {
    res.status(500).json([`Ha ocurrido un error: ${error.message}`])
  }
}

export const getTravel = async (req, res) => {
  const { id } = req.params
  try {
    const travelFound = await Travel.findByPk(id)
    if (!travelFound) {
      res.status(400).json(['No se encontro el viaje'])
    }
    res.status(200).json(travelFound)
  } catch (error) {
    res.status(500).json([`Ha ocurrido un error: ${error.message}`])
  }
}

export const getAllTravels = async (req, res) => {
  try {
    const travels = await Travel.findAll()
    res.status(200).json(travels)
  } catch (error) {
    res.status(500).json([`Ha ocurrido un error: ${error.message}`])
  }
}

export const getMyTravel = async (req, res) => {
  const { id } = req.params
  try {
    const travelFound = await Travel.findOne({ where: { id_user1: id } })
    if (!travelFound) {
      res.status(400).json(['No se encontro el viaje'])
    }
    res.status(200).json(travelFound)
  } catch (error) {
    res.status(500).json([`Ha ocurrido un error: ${error.message}`])
  }
}

export const getSharedTravel = async (req, res) => {
  const { id } = req.params
  try {
    const travelFound = await Travel.findOne(id)
    if (!travelFound) {
      res.status(400).json(['No se encontro el viaje'])
    }
    res.status(200).json(travelFound)
  } catch (error) {
    res.status(500).json([`Ha ocurrido un error: ${error.message}`])
  }
}

export const getAllLocationTravels = async (req, res) => {
  const { id } = req.params
  try {
    const travels = await Travel.findAll({ where: { id_location: id } })
    res.status(200).json(travels)
  } catch (error) {
    res.status(500).json([`Ha ocurrido un error: ${error.message}`])
  }
}

