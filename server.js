import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import connectDb from './config/connectDb.js';
import cors from 'cors';
import jobRoutes from './routes/jobRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
const app = express();
(async () => {
  await connectDb();
  // Start your server here or elsewhere
})();
app.use(cors()); 
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;




app.get("/",(req,res)=>{
    res.send("Server is running");
});
app.get("/date", (req, res) => {
    res.send(new Date().toLocaleString());
});

app.use("/user",userRoutes);

app.use("/jobs", jobRoutes);
app.use("/admin", adminRoutes);
export default app;