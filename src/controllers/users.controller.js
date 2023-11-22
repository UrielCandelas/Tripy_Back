import Expenses from "../models/expenses.model.js";
import User from "../models/auth.model.js";
import Travel from "../models/travels.model.js";
import Request from "../models/requests.model.js";

export const getUserById = async (req, res) => {
    const { id } = req.params
    try {
        const travels = await Travel.findAll({where: {id_location: id}})
        const userid = []
        const usersFoundArr = []
        for (let index = 0; index < travels.length; index++) {
          userid.push(travels[index].dataValues.id_user1)
            if (userid[index]) {
                const userFound = await User.findOne({where: {id: userid[index]}})
                usersFoundArr.push(userFound)
            }
        }
        res.status(200).json(usersFoundArr);
    } catch (error) {
        res.status(500).json(["Ha ocurrido un error"]);
        console.log(error)
    }
}

export const getUsersByRequest = async (req, res) => {
    const { id } = req.params
    try {
        const requests = await Request.findAll({where: {id_user1: id}})
        const userid = []
        const usersFoundArr = []
        for (let index = 0; index < requests.length; index++) {
            userid.push(requests[index].dataValues.id_user2)
              if (userid[index]) {
                  const userFound = await User.findOne({where: {id: userid[index]}})
                  usersFoundArr.push(userFound)
              }
          }
          res.status(200).json(usersFoundArr);
    } catch (error) {
        res.status(500).json(["Ha ocurrido un error"]);
    }
}