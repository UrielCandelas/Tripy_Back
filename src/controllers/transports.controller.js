import Transport from '../models/transport.model.js'

export const getAllTransports = async (req, res) => {
    try {
      const transportsFound = await Transport.findAll()
      res.status(200).json(transportsFound)
    } catch (error) {
      res.status(500).json([`Ha ocurrido un error: ${error.message}`])
    }
  }