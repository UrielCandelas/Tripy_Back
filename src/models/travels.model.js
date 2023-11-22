import sequelize from "../db.js";
import { DataTypes } from "sequelize";
import User from "./auth.model.js";
import Location from "./locations.model.js";
import Extra from "./extraComment.model.js";
import Transport from "./transport.model.js";
import Expenses from "./expenses.model.js";

const Travel = sequelize.define(
  "Travel",
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
    id_location: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    travel_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    id_transportation: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_expenses: {
      type: DataTypes.DECIMAL,
    },
    id_extras:{
      type: DataTypes.INTEGER,
    },
    companions:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isActive:{
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  },
  {
    tableName: "travels",
    timestamps: true,
  }
);
Travel.belongsTo(User, { foreignKey: "id_user1",as: "User1" });
Travel.belongsTo(User, { foreignKey: "id_user2",as: "User2" });
Travel.belongsTo(Location, { foreignKey: "id_location",as:"Location" });
Travel.belongsTo(Transport, { foreignKey: "id_transportation",as:"Transport" });
Travel.belongsTo(Expenses, { foreignKey: "id_expenses",as:"Expenses" });
Travel.belongsTo(Extra, { foreignKey: "id_extras",as:"Extras" });

export default Travel;
