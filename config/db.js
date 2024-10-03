import mongoose from "mongoose";
import 'dotenv/config'
const connectDB=async ()=>{
  await  mongoose.connect(process.env.URI).then(()=>console.log('db connected'));
}
export default connectDB;
