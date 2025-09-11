import express from 'express'
import { getUsers, listAllTodos, averageTodosByUsers, dailyCompletedTaskCount } from '../controllers/admin.controller'
import auth, { isAdmin } from '../middlewares/auth'

const server = express();
server.use(express.json());

server.get('/user', auth, isAdmin, getUsers);
server.get('/todo', auth, isAdmin, listAllTodos);
server.get("/avg-todo", auth, isAdmin, averageTodosByUsers);
server.get('/completed/daily-stats', auth, isAdmin, dailyCompletedTaskCount)

export default server;  