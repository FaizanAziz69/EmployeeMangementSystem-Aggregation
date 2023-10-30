import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import connectDB from './Db.js';
import employeeroutes from './routes/employeesRoutes.js'
import managerRoutes from './routes/managerRoutes.js'


connectDB()

const app = express()  
const PORT = 8000; 

app.use(express.json())
app.use(bodyParser.json());
app.use('/employee',employeeroutes)
app.use('/manager',managerRoutes)
app.listen(PORT, ()=>console.log(`the Server is ruuning on port:http://localhost${PORT}`))
app.get('/', (req,res)=>{;
    res.send('hello from homepage');
})     