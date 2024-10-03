import mongoose from 'mongoose'
const Schema=mongoose.Schema;

const cartSchema=Schema({
   product:{type:Schema.Types.ObjectId,ref:"Products"},
   quantity:{
       type:Number,
       default:1
   }
});
const userSchema= new Schema({
   name:{type:String,required:true},
   email:{type:String,required:true,unique:true},
   password:{type:String,required:true},
   cartData:[cartSchema,{minimize:false} ],//minimize false lets us to create data without this entry

});

const User=mongoose.models.user|| mongoose.model('User',userSchema);

export default User;