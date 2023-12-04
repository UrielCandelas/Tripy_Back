import Expenses from "../models/expenses.model.js";
import User from "../models/auth.model.js";
import Travel from "../models/travels.model.js";
import Request from "../models/requests.model.js";
import Commentary from "../models/commentary.model.js";
import { Op,literal } from "sequelize";
import Chat from "../models/chat.model.js";

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
      comentary_text: commentary_text,
        id_userComented,
        id_userComent,
        rate,
    })
    const commentarySaved = await newCommentary.save()
    res.status(200).json(commentarySaved)
  } catch (error) {
    console.log(error)
    res.status(500).json(["Ha ocurrido un error"]);
  }
};

export const getComentariesByID = async (req, res) => {
    const { id } = req.params
    console.log(id)
    const arrUsers = []
    const arrCommentaries = []
    try {
        const commentariesFound = await Commentary.findAll({ where: { id_userComented: id } })
        if (commentariesFound.length > 0) {
          for (let index = 0; index < commentariesFound.length; index++) {
            arrCommentaries.push(commentariesFound[index].dataValues)
            const userFound = await User.findByPk(arrCommentaries[index].id_userComent)
            arrUsers.push(userFound.dataValues)
        }
        const data= {
           users: arrUsers,
           commentaries: arrCommentaries 
        }
        res.status(200).json(data)
          
        }else {
          res.status(200).json([])
        }
        
    } catch (error) {
      console.log(error)
     res.status(500).json(["Ha ocurrido un error"]);   
    }
}

export const getContacts = async (req, res) => {
  const { id } = req.params;
  const contacts = []
  try {
    const travelFoundU1 = await Travel.findAll({
      where: { id_user1: id },
    });
    const travelFoundU2 = await Travel.findAll({
      where: { id_user2: id },
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
    const uniqueContacts = contacts.reduce((unique, contact) => {
      const existingContact = unique.find((item) => item.id === contact.id);
      if (!existingContact) {
        unique.push(contact);
      }
      return unique;
    }, []);
    res.status(200).json(uniqueContacts);
  } catch (error) {
    console.log(error)
    res.status(500).json(["Ha ocurrido un error"]);
  }
}

export const getMessages = async (req, res) => {
  const { id_user1, id_user2 } = req.body;
  try {
    const messages = await Chat.findAll({
      where: literal(`JSON_CONTAINS(users, '[${id_user1}, ${id_user2}]')`),
      order: [['updatedAt', 'ASC']],
    });
    const PMessages = messages.map((message) => {
      return {
        fromSelf: message.dataValues.id_user1 === id_user1,
        message: message.dataValues.message,
      };
    })
    res.status(200).json(PMessages);
  } catch (error) {
    console.log(error.message)
    res.status(500).json(["Ha ocurrido un error"]);
  }
}

export const registerNewMessage = async (req, res) => {
  const { id_user1, id_user2, message } = req.body;
  try {
    const newMessage = Chat.build({
      id_user1,
      id_user2,
      users: [id_user1, id_user2],
      message,
    });
    console.log(newMessage)
    const messageSaved = await newMessage.save();
    res.status(200).json(messageSaved);
    
  } catch (error) {
    console.log(error)
    res.status(500).json(["Ha ocurrido un error"]);
  }
}