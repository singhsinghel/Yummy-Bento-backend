import User from "../models/userModel.js"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'

const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

const createUser=async(req,res)=>{
   const {name,email,password}= req.body;
   try{
        const exist = await User.findOne({email});
         if(exist)
            return res.json({success:false,message:'Email is already registered'})
         
      //validating email and password  
      if(!validator.isEmail(email))  
         return res.json({success:false,message:'Please Enter valid email'});

      if(password.length<8)
         return res.json({success:false,message:"Please enter a strong password"});

      //hashing user password
      const salt=await bcrypt.genSalt(10)
      const hashedPassword=await bcrypt.hash(password,salt);
      
      const user= new User({name,email,password:hashedPassword});
      user.coupon.push('Welcome60');
      await user.save();
      const token=createToken(user._id);
      res.json({success:true,token,message:`Welcome ${user.name}`})
   }catch(err){
     console.log(err);
     res.json({success:false,message:err.message});
   }
   
}

//login user
const loginUser=async(req,res)=>{
  const {email,password}=req.body;
  
  try {
   //checking if user exists or not
   const user= await User.findOne({email});
   
   if(!user)
    return res.json({success:false,message:"User doesn't exists!"})

   //comparing passwords
   const isMatch=await bcrypt.compare(password,user.password)
   
   if(!isMatch)
    return  res.json({success:false,message:"Incorrect password"});
   
   const token=createToken(user._id);
   res.json({success:true,token,message:`Welcome back ${user.name}`})

  } catch (error) {
   return res.json({success:false,message:error.message})
  }
};


export {createUser,loginUser};