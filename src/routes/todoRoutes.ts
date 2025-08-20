import express from 'express'
import { createTodos, listTodos, updateTodos, deleteTodos } from '../controllers/todo.controller'
import { validateId } from '../middlewares/todoValidations'
const server = express();
server.use(express.json());

server.post('/', createTodos);
server.get('/', listTodos);
server.patch('/:id', validateId, updateTodos);
server.delete('/:id', validateId,  deleteTodos);
export default server;  