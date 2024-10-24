import jwt from 'jsonwebtoken';


const authMiddleware=async(req,res,next)=>{
    
    const{token}=req.headers;
    if(!token)
        return res.json({success:false,message:"Not Authorized, Login again"})

    try{
         const tokenDecode=jwt.verify(token,process.env.JWT_SECRET);
         req.body.userId=tokenDecode.id;
         next();
    }catch(err){
        console.log(err);
          res.json({success:false,message:'Error occured'})
    }
}

const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}


export  {authMiddleware,createToken}