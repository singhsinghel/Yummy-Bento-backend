import  Admin from "../models/admin.js"
import bcrypt from 'bcrypt'
import validator from 'validator'
import { createToken } from "../middleware/authMiddleware.js"


const adminSignup=async(req,res)=>{
    try {
       const isAdminExists = await Admin.find();

       //checking if admin exists
       if(isAdminExists.length>0)
           return res.json({success:false,message:'Admin already created'});

       const{name,email,password}=req.body;
      
       //validating email and password  
        if(!validator.isEmail(email))  
          return res.json({success:false,message:'Please Enter valid email'}) 
      
       if(password.length<8)
          return res.json({success:false,message:"Please enter a strong password"});

       //hashing user password
       const salt=await bcrypt.genSalt(10)
       const hashedPassword=await bcrypt.hash(password,salt);

       const admin = new Admin({name:name,email:email,password:hashedPassword});

       admin.save()
       const token = createToken(admin._id);
       res.json({success:true,message:'admin created successfully',token});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"error occured while creating admin"})
        
        
    }


}

const adminLogin=async(req,res)=>{
    try {
        const {email,password}=req.body;
      
        const admin=await Admin.findOne({email:email});
        console.log(admin.password);
        
        if(!admin)
         return res.json({success:false,message:"Admin doesn't exists!"})
         
        //comparing passwords
        const isMatch=await bcrypt.compare(password,admin.password);
         
        if(!isMatch)
           return  res.json({success:false,message:"Incorrect password"});

        const token=createToken(admin._id);
      
        res.json({success:true,token,message:`Welcome Admin`})
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error occured"})
        
    }

}

export {adminSignup,adminLogin}