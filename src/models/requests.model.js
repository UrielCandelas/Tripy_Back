import sequelize from "../db.js";
import { DataTypes } from "sequelize";
import Travel from "./travels.model.js";
import User from "./auth.model.js";

const Request = sequelize.define(
  "Request",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_user1: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_user2: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    id_travel : {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
  },
  {
    tableName: "travel_requests",
    timestamps: true,
  }
);

Request.belongsTo(User, { foreignKey: "id_user1",as: "User1" });
Request.belongsTo(User, { foreignKey: "id_user2",as: "User2" });
Request.belongsTo(Travel, { foreignKey: "id_travel",as: "Travel" });


export default Request;
