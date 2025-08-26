import express from 'express'
import { getUsers, listAllTodos } from '../controllers/admin.controller'
import auth, { isAdmin } from '../middlewares/auth'

const server = express();
server.use(express.json());

server.get('/user', auth, isAdmin, getUsers);
server.get('/todo', auth, isAdmin, listAllTodos);

export default server;  