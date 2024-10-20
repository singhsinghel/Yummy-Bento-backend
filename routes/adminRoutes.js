import express from 'express'
import { adminLogin, adminSignup } from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const adminRouter=express.Router()

adminRouter.post('/signup',adminSignup);
adminRouter.post('/login',adminLogin);

export default adminRouter;