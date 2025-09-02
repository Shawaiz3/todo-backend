import express from 'express'
import { getUsers, listAllTodos, getTodosPerUser, averageTodosByUsers } from '../controllers/admin.controller'
import auth, { isAdmin } from '../middlewares/auth'

const server = express();
server.use(express.json());

server.get('/user', auth, isAdmin, getUsers);
server.get('/todo', auth, isAdmin, listAllTodos);
server.get("/todo-per-user", auth, isAdmin, getTodosPerUser);
server.get("/avg-todo", auth, isAdmin, averageTodosByUsers);

export default server;  