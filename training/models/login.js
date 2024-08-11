const mongoose=require('mongoose')

const loginSchema=mongoose.Schema({
    userName:String,
    email:String,
    password:String
});

const Login=mongoose.model('login',loginSchema);

module.exports=Login;