import express from "express";
import dotenv from "dotenv"
import connectDB from "./config/db"
import todoRoutes from "./routes/todoRoutes"
dotenv.config();
connectDB();
const server = express();

server.use("/api/todo",todoRoutes)

server.listen(process.env.port, () => {
    console.log(`Started at Port ${process.env.port}`)
})