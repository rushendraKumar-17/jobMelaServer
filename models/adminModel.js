import { sequelize } from "../config/connectDb.js";

import { DataTypes } from "sequelize";
const admin = sequelize.define(
  "Admin",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role:{
      type: DataTypes.ENUM("admin", "super-admin"),
      defaultValue: "admin"
    },
    company:{
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "admins",
    timestamps: true,
  }
);
export default admin;
