import sequelize from "../db.js";
import { DataTypes } from "sequelize";

const Extra = sequelize.define(
  "Extra",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    extra_commentary:{
      type: DataTypes.CHAR(125),
      allowNull: false,
    }
  },
  {
    tableName: "det_extras",
    timestamps: true,
  }
);
export default Extra;
