import sequelize from "../db.js";
import { DataTypes } from "sequelize";

const Expenses = sequelize.define(
  "Expenses",
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
    id_travel: {
      type: DataTypes.INTEGER,
    },
    expense: {
        type: DataTypes.CHAR(20),
        allowNull: false,
    },
    quantity: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    }
  },
  {
    tableName: "det_expenses",
    timestamps: true,
  }
);

export default Expenses;
