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

//search food
const searchFood=async(req,res)=>{
    const {query}=req.body;
    try {
        const regex = new RegExp(query, 'i'); 
        const searchFields = ['name', 'description','category'];
        const searchConditions = searchFields.map(field => ({
        [field]: { $regex: regex }
        }));
        const foods=  await Food.find({ $or:searchConditions});  
        res.json({success:true,data:foods,message:"fetched successfully"})
    } catch (error) {
        console.log(error);
    }
}
const updateFood=async(req,res)=>{
    try{
        const food = await Food.findByIdAndUpdate(req.params.id,req.body)
        res.json({success:true,message:'Item updated successfully'});

    }catch(err){
        res.json({success:false,message:'Error occured while updating'})
    }
}

export  {addFood,showFood,removeFood,searchFood}