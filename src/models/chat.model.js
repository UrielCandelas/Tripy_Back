import sequelize from "../db.js";
import { DataTypes } from "sequelize";
import User from "./auth.model.js";

const Chat = sequelize.define(
  "Chat",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_user1: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_user2: {
      type: DataTypes.INTEGER,
    },
    message: {
      type: DataTypes.CHAR(255),
      allowNull: false,
    },
    rooms:{
      type: DataTypes.CHAR(50),
      allowNull: false,
    }
  },
  {
    tableName: "chat_messages",
    timestamps: true,
  }
);

Chat.belongsTo(User, { foreignKey: "id_user1",as: "User1" });
Chat.belongsTo(User, { foreignKey: "id_user2",as: "User2" });

export default Chat;
