import sequelize from "../db.js";
import { DataTypes } from "sequelize";

const Location = sequelize.define(
  "Location",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    location_name: {
      type: DataTypes.CHAR(20),
      allowNull: false,
    },
    location: {
      type: DataTypes.CHAR(125),
      allowNull: false,
    },
    description: {
      type: DataTypes.CHAR(125),
      allowNull: false,
    },
    rate: {
      type: DataTypes.DECIMAL,
    },
    cost: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    schedule: {
      type: DataTypes.CHAR(20),
      allowNull: false,
    },
  },
  {
    tableName: "cat_locations",
    timestamps: true,
  }
);

export default Location;
