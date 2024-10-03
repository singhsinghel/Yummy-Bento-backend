import express from 'express';
import{addFood, removeFood, showFood} from '../controllers/foodController.js'
import multer from 'multer';

const foodRouter=express.Router();

//Image Storage Engine
const storage=multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now}${file.originalname}`) //to rename the file so that to make it unique.(By adding date to it's name)
    }
})
const upload=multer({storage:storage})

foodRouter.post('/add',upload.single('image'), addFood);
foodRouter.get('/list',showFood);
foodRouter.post('/:id/delete',removeFood);


export default foodRouter