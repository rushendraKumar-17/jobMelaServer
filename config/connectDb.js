import { Sequelize } from "sequelize";

let sequelizeInstance = null;

const connectDb = async () => {
  
  if (sequelizeInstance) {
    console.log("Using existing database connection.");
    return sequelizeInstance;
  }
  
  sequelizeInstance = new Sequelize(
    "so",        // your DB name
    "postgres",  // your DB user
    "171816",    // your DB password
    {
      host: process.env.DB_HOST || "localhost",
      dialect: "postgres",
      logging: false,
    }
  );

  try {
    await sequelizeInstance.authenticate();
    console.log("Connection to the database has been established successfully.");

    // Sync all models here (creates tables if they don't exist)
    await sequelizeInstance.sync({ alter: true }); // or { force: true } to drop & recreate tables
    console.log("All models were synchronized successfully.");

  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  return sequelizeInstance;
};

export const sequelize = await connectDb();  // Await to ensure it's connected before export
export default connectDb;
