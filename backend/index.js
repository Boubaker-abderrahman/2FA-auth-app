// const express= require('express')
// const {connectDb} = require('./db/connectDb')
// const dotenv =require('dotenv')

import express from "express";
import { connectDb } from "./db/connectDb.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import authRoutes from './routes/authRoutes.js'


dotenv.config()


const app = express()
const PORT = process.env.PORT || 5000
const __dirname = path.resolve()



app.use(express.json())

app.use(cookieParser())

// app.use(cors({origin : "http://localhost:5173",credentials : true }))

app.use('/api/auth' , authRoutes)

app.use(express.static(path.join(__dirname,"frontend/dist")))


app.get("*" , (req,res)=>{
    res.sendFile(path.join(__dirname,"frontend","dist","index.html"))
})

app.listen(PORT, ()=>{
    connectDb()
    mongoose.connection.on('open' , ()=>{
        console.log('db open')
    })
    console.log('server is runnig on port:',PORT)
})


