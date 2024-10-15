import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js';
import {placeOrder,verifyOrder,userOrders, fetchOrders, changeStatus} from '../controllers/orderController.js'

const orderRouter=express.Router();

orderRouter.post('/place',authMiddleware,placeOrder)
orderRouter.post('/verify',verifyOrder)
orderRouter.post('/userorders',authMiddleware,userOrders)
orderRouter.get('/fetchorders',fetchOrders)
orderRouter.post('/changestatus',changeStatus)
export default orderRouter;