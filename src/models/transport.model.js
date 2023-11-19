import sequelize from "../db.js";
import { DataTypes } from "sequelize";

const Transport = sequelize.define(
  "Transport",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    transport:{
      type: DataTypes.CHAR(10),
      allowNull: false,
    }
  },
  {
    tableName: "cat_transport",
    timestamps: true,
  }
);

export default Transport;
