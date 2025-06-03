import { sequelize } from "../config/connectDb.js";
import { DataTypes } from "sequelize";

const Application = sequelize.define(
  "Application",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("applied", "interviewed", "on hold","moved to next round","rejected","selected"),
      defaultValue: "applied",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    comments: {
      type: DataTypes.JSONB, // JSONB stores array of objects efficiently
      defaultValue: [],
    },
  },
  {
    tableName: "applications",
    timestamps: true,
  }
);

export default Application;
