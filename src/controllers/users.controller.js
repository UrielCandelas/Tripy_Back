import Expenses from "../models/expenses.model.js";
import User from "../models/auth.model.js";
import Travel from "../models/travels.model.js";
import Request from "../models/requests.model.js";
import Commentary from "../models/commentary.model.js";

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const travels = await Travel.findAll({ where: { id_location: id } });
    const userid = [];
    const usersFoundArr = [];
    for (let index = 0; index < travels.length; index++) {
      userid.push(travels[index].dataValues.id_user1);
      if (userid[index]) {
        const userFound = await User.findOne({ where: { id: userid[index] } });
        usersFoundArr.push(userFound);
      }
    }
    res.status(200).json(usersFoundArr);
  } catch (error) {
    res.status(500).json(["Ha ocurrido un error"]);
    console.log(error);
  }
};

export const getUsersByRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const requests = await Request.findAll({ where: { id_user1: id } });
    const userid = [];
    const usersFoundArr = [];
    for (let index = 0; index < requests.length; index++) {
      userid.push(requests[index].dataValues.id_user2);
      if (userid[index]) {
        const userFound = await User.findOne({ where: { id: userid[index] } });
        usersFoundArr.push(userFound);
      }
    }
    res.status(200).json(usersFoundArr);
  } catch (error) {
    res.status(500).json(["Ha ocurrido un error"]);
  }
};

export const registerNewCommentary = async (req, res) => {
  const { commentary_text, id_userComented, id_userComent, rate } = req.body;
  try {
    const newCommentary = Commentary.build({
        commentary_text,
        id_userComented,
        id_userComent,
        rate,
    })
    const commentarySaved = await newCommentary.save()
    res.status(200).json(commentarySaved)
  } catch (error) {
    res.status(500).json(["Ha ocurrido un error"]);
  }
};

export const getComentariesByID = async (req, res) => {
    const { id } = req.params
    const arrUsers = []
    const arrCommentaries = []
    try {
        const commentariesFound = await Commentary.findAll({ where: { id_userComented: id } })
        for (let index = 0; index < commentariesFound.length; index++) {
            arrCommentaries.push(commentariesFound[index].dataValues)
            const userFound = await User.findByPk(arrUsers[index].id_userComent)
            arrUsers.push(userFound.dataValues)
        }
        const data= {
           users: arrUsers,
           commentaries: arrCommentaries 
        }
        res.status(200).json(data)
    } catch (error) {
     res.status(500).json(["Ha ocurrido un error"]);   
    }
}
