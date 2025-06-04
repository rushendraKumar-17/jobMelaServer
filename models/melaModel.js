import { sequelize } from "../config/connectDb.js";
import { DataTypes } from "sequelize";

const Mela = sequelize.define(
    "Mela",
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            defaultValue: "",
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        area:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        location:{
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
        },
        companies:{
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: [],
        },
        vacancies:{
            type:DataTypes.STRING,
            defaultValue:"0"
        },
        applications:{
            type:DataTypes.STRING,
            defaultValue:"0"
        },
        selectedCandidates:{
            type:DataTypes.STRING,
            defaultValue:"0"
        }
    },
    {
        tableName: "melas",
        timestamps: true,
       
    }
);
export default Mela;