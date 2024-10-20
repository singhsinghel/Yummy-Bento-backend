import express from 'express';
import  cors from'cors';
import connectDB from './config/db.js';
import foodRouter from './routes/foodRoutes.js';
import userRoute from './routes/userRoutes.js';
import 'dotenv/config'
import cartRouter from './routes/cartRoutes.js';
import orderRouter from './routes/orderRoute.js';
import schedule from 'node-schedule'
import axios from 'axios'
import adminRouter from './routes/adminRoutes.js';


const app=express();
const port =process.env.PORT||8080;

//middleware
app.use(express.json()) //for parsing the request recieved from frontend.
app.use(cors()); //for accessing backend from any frontend

//db connection
connectDB();

//api endpoints
app.use('/api/food',foodRouter);
//mounted uploads folder to access file by giving filename
app.use('/images',express.static('uploads')); 
app.use('/api/user',userRoute);
app.use('/api/cart',cartRouter);
app.use('/api/order',orderRouter);
app.use('/api/admin',adminRouter)

const keepAliveJob = schedule.scheduleJob('*/5 * * * *', async () => {
    try {
        // Replace with your actual app URL
        await axios.get(`https://yummy-bento-backend.onrender.com/ping`)
    } catch (error) {
        console.log('Ping failed:', error.message);
    }
});

app.get('/ping', (req, res) => {
    res.sendStatus(200); // Respond to the ping
});
app.get('/',(req,res)=>{
    res.send('hiii');
});


app.listen(port,()=>{
    console.log('App is listening on server '+port);
    
})