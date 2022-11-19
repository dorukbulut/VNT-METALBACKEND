//imports
import express from "express";
import dotenv from "dotenv";
import cors from 'cors'
import router from "./routes/index.js";
import db from "./config/database.js";
import cookieParser from 'cookie-parser';
import Models from "./models/index.js";
//dotenv config
dotenv.config()

/*express config*/
const app = express();
app.use(cors({
  origin : process.env.FRONTEND,
  credentials : true
}))
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//import route
app.use("/api",router)

//Connect to db

try {
  await db.authenticate();
  await db.sync({alter: true});
  console.log('Connection has been established successfully.');
}

catch (error) {
  console.error('Unable to connect to the database:', error);
};




export default app;
