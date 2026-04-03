import express from "express";
import cors from "cors";

import authRoutes from ".routes/authRoutes.js";
import userRoutes from ".routes/userRoutes.js";
import recordRoutes from ".routes/recordRoutes.js";
import dashboardRoutes from ".routes/dashboardRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware";


const app = express();

//allow json body
app.use(express.json());
//allow cors (frontend can call backend)
app.use(cors());

//Routes
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/records",recordRoutes);
app.use("/api/dashboard",dashboardRoutes);


//test route
app.get("/",(req,res)=>{
    res.send("Api is running...");
})

//error handler
app.use(errorHandler);

export default app;