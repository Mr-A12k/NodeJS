const express = require('express');
const app = express();
const mongoose = require('mongoose');


app.use(express.json());

async function connectToDatabase() {
    try {
        await mongoose.connect("mongodb://localhost:27017/", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Connection error:", error);
    }
}

connectToDatabase();


const schema={
    name:String,
    email:String,
    id:Number
}
const mon=mongoose.model("API",schema);

app.get('/',(req,res)=>{
    res.send("hello from node")
})

app.post("/post",async(req,res)=>{
    console.log("inside function");
    const data=new mon({
        name:req.body.name,
        email:req.body.email,
        id:req.body.id
    });
    const val=await data.save();
    res.json(val)
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});