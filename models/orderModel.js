import mongoose from "mongoose";
const Schema=mongoose.Schema;

const orderSchema=new Schema({
    userId:{type:String,required:true},
    items:{type:Array,requird:true},
    amount:{type:Number,required:true},
    address:{type:Object,required:true},
    status:{type:String, default:"Food Processing"},
    date:{type:Date,default:Date.now()},
    payment:{type:Boolean,default:false}
});

const Order=mongoose.model.Order|| mongoose.model('Order',orderSchema);

export default Order