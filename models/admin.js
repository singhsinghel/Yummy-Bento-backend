import mongoose from 'mongoose'
const Schema=mongoose.Schema;

const adminSchema= new Schema({
   name:{type:String,required:true},
   email:{type:String,required:true,unique:true},
   password:{type:String,required:true},
});

const Admin=mongoose.models.user|| mongoose.model('Admin',adminSchema);

export default Admin;