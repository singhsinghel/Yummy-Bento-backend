import express from 'express';
import{addFood, removeFood, searchFood, showFood} from '../controllers/foodController.js'
import multer from 'multer';
import { authMiddleware } from '../middleware/authMiddleware.js';

const foodRouter=express.Router();

//Image Storage Engine
const storage=multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now}${file.originalname}`) //to rename the file so that to make it unique.(By adding date to it's name)
    }
})
const upload=multer({storage:storage})

foodRouter.post('/add',upload.single('image'),authMiddleware, addFood);
foodRouter.get('/list',showFood);
foodRouter.post('/:id/delete',removeFood);
foodRouter.post('/search',searchFood);


export default foodRouter