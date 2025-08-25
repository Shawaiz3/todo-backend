import express from 'express'
import auth from '../middlewares/auth'
import { validateTodoBody } from '../middlewares/bodyValidation'
import { createTodos, listTodos, updateTodos, deleteTodos } from '../controllers/todo.controller'
import { validateId } from '../middlewares/todoValidations'
import { findTodoById } from '../middlewares/todoFinder'

const server = express();
server.use(express.json());

server.post('/', auth, validateTodoBody, createTodos);
server.get('/', auth, listTodos);
server.patch('/:id', auth, validateId, findTodoById, validateTodoBody, updateTodos);
server.delete('/:id', auth, validateId, findTodoById, deleteTodos);
export default server;  