import Order from "../models/orderModel.js"
import User from "../models/userModel.js"
import Stripe from "stripe"

const stripe=new Stripe(process.env.STRIPE_SECRET_KEY)

const placeOrder=async(req,res)=>{
   const frontendUrl='https://yummy-bento.onrender.com/';
   try {
      //creating order
      const order=await new Order({
      userId:req.body.userId,
      items:req.body.items,
      amount:req.body.amount,
      address:req.body.address
      });

      //saving order in database
      await order.save();

      //cleaning user's cart Data
      await User.findByIdAndUpdate(req.body.userId,{cartData:{}});

      //creating lineitems for stripe
      const lineItems=req.body.items.map((item)=>({
         price_data:{
            currency:"inr",
            product_data:{
               name:item.name
            },
            unit_amount:item.price*100
         },
         quantity:item.quantity
      }));

      //adding delivery charges
      lineItems.push({
      price_data:{
         currency:"inr",
         product_data:{
            name:"Delivery Charges"
         },
         unit_amount:20*100,
      },
      quantity:1
      });
      const session= await stripe.checkout.sessions.create({
         line_items:lineItems,
         mode:'payment',
         success_url:`${frontendUrl}/verify?success=true&orderId=${order._id}`,
         cancel_url:`${frontendUrl}/verify?succes=false&orderId=${order._id}`,   
      }); 
      res.json({success:true,session_url:session.url,message:"redirecting"});
   } catch (error) {
      console.log(error);
      res.json({success:false,messsage:"error occured"})
      
      
   }
}

const verifyOrder=async(req,res)=>{
   try {
      const {success,orderId}=req.body;
      if(success==='true'){
        await Order.findByIdAndUpdate(orderId,{payment:true});
        res.json({success:true,message:"Payment Successfull"})
      }
      else{
        await Order.findByIdAndDelete(orderId);
        res.json({success:false,messsage:'Payment unsuccessfull'})
      }
      
   } catch (error) {
      console.log(error);
      res.json({success:false,message:"Error Occured"})
      
   }
}

const userOrders=async(req,res)=>{
   try {
      const orders=await Order.find({userId:req.body.userId});      
      res.json({success:true,data:orders});
   } catch (error) {
      res.json({success:false,message:"Error occured"})
   }
}

//orders for admin panel
const fetchOrders=async(req,res)=>{
   try{
      const orders=await Order.find({});      
      res.json({success:true,data:orders});
   }catch{
      res.json({success:false,message:'Error occured'})
   }
}

const changeStatus=async(req,res)=>{
     try {
       const {orderId,status}=req.body;
       const order=await Order.findByIdAndUpdate(orderId,{status},{new:true}); 
       console.log(order);
          
       res.json({success:true,status:status});
     } catch (error) {
      res.json({success:false,message:"error Occurred"})
     }
}
export  {placeOrder,verifyOrder,userOrders,fetchOrders,changeStatus}