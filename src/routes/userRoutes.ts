import express from 'express'
import { register, login, logout } from '../controllers/user.controller';

const server = express();
server.use(express.json());

server.post('/register', register);
server.post('/login', login);
server.post('/logout', logout);

export default server;  