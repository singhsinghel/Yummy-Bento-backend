import express from 'express';
import  cors from'cors';
import connectDB from './config/db.js';
import foodRouter from './routes/foodRoutes.js';
import userRoute from './routes/userRoutes.js';
import 'dotenv/config'


const app=express();
const port =process.env.port||8080;

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

app.get('/',(req,res)=>{
    res.send('hiii');
});


app.listen(port,()=>{
    console.log('App is listening on server '+port);
    
})