import sequelize from "../db.js";
import { DataTypes } from "sequelize";
import User from "./auth.model.js";

const Commentary = sequelize.define(
  "Commentary",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    commentary_text: {
      type: DataTypes.CHAR(50),
      allowNull: false,
    },
    rate: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    id_userComented: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_userComent: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "user_comments",
    timestamps: true,
  }
);

Commentary.belongsTo(User, {
  foreignKey: "id_userComented",
  as: "userComented",
});

Commentary.belongsTo(User, {
  foreignKey: "id_userComent",
  as: "userComent",
});
export default Commentary;
