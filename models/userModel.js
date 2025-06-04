import { sequelize } from "../config/connectDb.js";
import { DataTypes } from "sequelize";

const User = sequelize.define(
  "User",  
  {
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    verificationCode: {
      type: DataTypes.STRING,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verificationCodeExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    phone:{
      type: DataTypes.STRING,
      defaultValue:""
    },
    CVUrl: {
      type: DataTypes.STRING, 
      defaultValue:""
    },
    yearsOfExperience:{
      type:DataTypes.STRING,
      defaultValue: "0"
    },
    skills:{
      type:DataTypes.ARRAY(DataTypes.STRING),
      defaultValue:[]
    },
    degrees:{
      type:DataTypes.ARRAY(DataTypes.STRING),
      defaultValue:[]
    },
    address:{
      type:DataTypes.STRING,
      defaultValue: ""
    },
    yearOfGraduation:{
      type:DataTypes.STRING,
      defaultValue: "any"
    },
    gender: {
      type: DataTypes.STRING,
      defaultValue: "any"
    },
    languages: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    formSubmitted:{
      type:DataTypes.BOOLEAN,
      defaultValue: false
    },
    role:{
      type:DataTypes.STRING,
      defaultValue: "user"
    }
  },
  {
    tableName: "users", 
    timestamps: true,
  }
);

export default User;
