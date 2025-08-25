import express from "express";
import dotenv from "dotenv"
import cors from "cors";

import connectDB from "./config/db"
import todoRoutes from "./routes/todoRoutes"
import userRoutes from "./routes/userRoutes"

dotenv.config();
connectDB();
const server = express();

server.use(cors())
server.use("/api/user",userRoutes)
server.use("/api/todo",todoRoutes)

server.listen(process.env.port, () => {
    console.log(`Started at Port ${process.env.port}`)
})
