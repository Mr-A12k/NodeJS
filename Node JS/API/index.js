const express = require('express')
const mongoose = require('mongoose')
const url = 'mongoose://localhost/Kabix'

// app.use(express)

const app = express()
mongoose.connect=(url,{useNewUserParser:true})

const con = mongoose.connection

const kabixRouter = require('./routs/alien')
app.use('./products',kabixRouter)

con.on('open',()=>{
    console.log("connected...");
})

app.listen(8000,()=>{
    console.log("Server connected")
})