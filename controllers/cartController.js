import User from '../models/userModel.js'
import Food from '../models/foodModel.js'

//add items to cart
const addToCart=async(req,res)=>{
  try{
      const user=await User.findById(req.body.userId);
      const cartData=user.cartData ||{};

      if(!cartData[req.body.itemId]){

          cartData[req.body.itemId]=1;
      }
      else{
        cartData[req.body.itemId]+=1;
      }
      const userfinal=  await User.findByIdAndUpdate(req.body.userId,{cartData:cartData},{new:true});
    
      res.json({
        success: true,
        message: "Product added to cart successfully",
        cart: userfinal.cartData,
      });
  }catch(err){
    res.status(500).json({
        success: false,
        message: "An error occurred while adding the product to the cart",
        error: err.message,
      });
  }
}
//remove items from cart
const removeFromCart=async(req,res)=>{
  try{
  const user=await User.findById(req.body.userId);
  const cartData=user.cartData;
  
  if(cartData[req.body.itemId]===1)
    delete cartData[req.body.itemId];

  else if(!cartData[req.body.itemId])
    return res.json({success:false,message:'Item does not exist in cart'})

  else{
    cartData[req.body.itemId]-=1;
  }
  const userfinal=  await User.findByIdAndUpdate(req.body.userId,{cartData:cartData},{new:true})
   res.json({
    success: true,
    message: "Cart updated successfully",
    cart: userfinal.cartData,
   });
  }catch(err){
    console.log(err);
    res.status(500).json({success:false,message:'Error occured'})
  }
  }
  
//get Cart data
const getCart=async(req,res)=>{
  try{
   const user= await User.findById(req.body.userId);
   const cartData=user.cartData;
   res.json({success:true,cartData:cartData});
  }catch(err){
    console.log(err);
    res.json({success:false,message:"Error while fetching data"});
  }
} 
export {addToCart,removeFromCart,getCart}