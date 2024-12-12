import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import AppRoutes from './src/routes/index.js'
dotenv.config()
let app = express()
app.use(cors({
    origin: 'http://localhost:5174', // or use '*' to allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Define allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Define allowed headers
  }));
app.use(express.json())
app.use(AppRoutes)
app.listen(process.env.PORT, ()=>console.log("app is running in " + process.env.PORT))