import express from "express";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js"
import propertyRoute from "./routes/propertyRoute.js"
import mongoose from "mongoose";
import messageRoute from "./routes/messageRoute.js"
import cors from "cors";
const app = express();
dotenv.config({ path: "./config/config.env" });

app.use(express.json());
app.use(
  cors({
    origin: '*',
    method: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);


// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user",userRoute);
app.use("/api/v1/property",propertyRoute);
app.use("/api/v1/message",messageRoute)

mongoose.connect(process.env.MONGO_URI, {
        dbName: "broker_project"
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch(err => {
    console.error('Error connecting to MongoDB', err);
  });

app.listen(process.env.PORT,()=>{
    console.log(`server is up  on port ${process.env.PORT}`);
})
export default app;