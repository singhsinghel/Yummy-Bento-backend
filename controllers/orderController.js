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
      totalAmount:req.body.totalAmount,
      amount:req.body.amount,
      address:req.body.address,
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
      
      //apply coupon if discount exists
      let coupon;
      if(order.amount!==order.totalAmount){
          const discountPercentage=parseInt(((((req.body.totalAmount)-req.body.amount)/req.body.totalAmount) * 100))
          coupon = await stripe.coupons.create({
            duration: 'repeating',
            name:`${discountPercentage}% off on fresh items`,
            duration_in_months: 3,
            percent_off: discountPercentage,
          });
      }
      //create stripe session   
      const sessionData=   {
         line_items:lineItems,
         mode:'payment',
         success_url:`${frontendUrl}verify?success=true&orderId=${order._id}`,
         cancel_url:`${frontendUrl}verify?succes=false&orderId=${order._id}`,   
         shipping_options:[{
            shipping_rate_data: {
               type: 'fixed_amount',
               fixed_amount: {
                 amount: 20*100, // Fixed delivery charge in cents
                 currency: 'inr',
               },
               display_name: 'Delivery Charges',
            }
         }]
      }
      if(coupon){
         sessionData.discounts = [
            {
              coupon: coupon.id,
            },
          ];
      }
      const session= await stripe.checkout.sessions.create(sessionData); 

      //updating coupon data
      const newDiscount=order.totalAmount>500?25:10;
      if (coupon) {
         await User.findByIdAndUpdate(req.body.userId,{$pull:{coupon:{_id:req.body.coupon}}},{new:true});
      }
      const user=await User.findByIdAndUpdate(
         req.body.userId,
         {
          $push:{
            coupon:{name:`Extra ${newDiscount}% off`,discount:newDiscount}
         }}
         ,{new:true});

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
const getDiscount=async(req,res)=>{
   try {
      const {userId}=req.body;      
      const user=await User.findById(userId);
      
      res.json({success:true,data:user.coupon});
      
   } catch (error) {
      res.json({success:false,message:"error occured while getting coupon code"})
   }
}
export  {placeOrder,verifyOrder,userOrders,fetchOrders,changeStatus,getDiscount}