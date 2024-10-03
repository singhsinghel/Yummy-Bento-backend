import Food from "../models/foodModel.js";
import fs from 'fs';

//add food item
const addFood= async(req,res)=>{
    const {name,description,price,category}=req.body
    
    let imageFileName=req.file.filename;
    
    const newFood=  new Food({name,description,price,category,image:imageFileName});
    try{
        await newFood.save();
        res.json({success:true,message:"Food Added"})
    }catch(err){
        console.log(err);
        res.json({success:false,message:`Error Occured: ${err.message}`})
    }
};

//all food list
const showFood=async(req,res)=>{
    try{
    const foods= await Food.find({});
    res.json({success:true,data:foods})
    console.log(foods);
    }catch(err){
       console.log(err);
       res.json({success:false,message:err})
    } 
}

//remove food
const removeFood=async(req,res)=>{
   try{
    const food=await Food.findByIdAndDelete(req.params.id);
    //to delete the photo from uploads folder
    fs.unlink(`uploads/${food.image}`,()=>{})
    res.json({success:true,message:'Food Item Deleted Successfully'})
   }catch(err){
    console.log(err);
    res.json({success:false,message:'Error occured while deleting'})
    
   }
}

export  {addFood,showFood,removeFood}