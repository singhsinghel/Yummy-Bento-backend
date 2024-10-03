import express from 'express'
import { Router } from 'express'
import { createUser,loginUser } from '../controllers/userController.js';

const userRoute=express.Router();


userRoute.post('/login',loginUser);
userRoute.post('/register',createUser);

export default userRoute;