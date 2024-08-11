const express = require('express')
const router = express.Router()


router.get('/',async(req,res)=>{
    try {
        res.send('Get request')
    } catch (error) {
        res.send("Error"+error)
    }
})

module.exports=router