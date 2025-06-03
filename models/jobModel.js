import { sequelize } from "../config/connectDb.js";
import { DataTypes } from "sequelize";

const Job = sequelize.define(
  "Job",  
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      defaultValue: "any"
    },
    minYearOfGraduation: {
      type: DataTypes.STRING, 
      defaultValue: "any"
    },
    maxYearOfGraduation: {
      type: DataTypes.STRING, 
      defaultValue: "any"
    },
    salary: {
      type: DataTypes.STRING, 
      defaultValue: "any"
    },
    yearsOfExperience: {
      type: DataTypes.STRING,
      defaultValue: "any"
    },
    languagesKnown:{
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [] 
    },
    degrees: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    skills: {
      type: DataTypes.ARRAY(DataTypes.STRING), 
      defaultValue: []
    },
    branch: {
      type: DataTypes.STRING, 
      defaultValue: "any"
    },
    requirements: {
      type: DataTypes.ARRAY(DataTypes.STRING), 
      defaultValue: []
    },
    applicationCount:{
      type: DataTypes.INTEGER,
      defaultValue: 0 
    },
    
  },
  {
    tableName: "jobs",
    timestamps: true, 
  }
);
export default Job;
