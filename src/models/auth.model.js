import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.CHAR(40),
      allowNull: false,
    },
    name: {
      type: DataTypes.CHAR(20),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.CHAR(20),
      allowNull: false,
    },
    secondLastName:{
      type: DataTypes.CHAR(20),
      allowNull: false,
    },
    userName:{
      type: DataTypes.CHAR(15),
      allowNull: false,
    },
    password: {
      type: DataTypes.CHAR(65),
      allowNull: false
    },
    rate: {
      type: DataTypes.DECIMAL,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);
export default User;
