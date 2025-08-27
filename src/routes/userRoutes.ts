import express from 'express'
import { register, login, refresh, logout } from '../controllers/user.controller';
import { validateUserBody } from '../middlewares/bodyValidation'

const server = express();
server.use(express.json());

server.post('/register', validateUserBody, register);
server.post('/login', validateUserBody, login);
server.post('/refresh', refresh);
server.post('/logout', logout);

export default server;  