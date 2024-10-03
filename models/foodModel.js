import mongoose from "mongoose";

const Schema=mongoose.Schema;

const foodSchema=new Schema({
    name:{
        type:String,
        requied:true
    },
    description:{
        type:String,
        requied:true
    },
    price:{
        type:Number,
        requied:true
    },
    image:{
        type:String,
        requied:true
    },
    category:{
        type:String,
        requied:true
    },
})

const Food = mongoose.model.Food|| mongoose.model('Food',foodSchema);
export default Food;