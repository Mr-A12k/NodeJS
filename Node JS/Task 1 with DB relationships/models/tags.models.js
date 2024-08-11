const mongoose = require('mongoose')
const Product = require('./products.models')
const tagSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    products:[{
        type:mongoose.Schema.ObjectId,
        ref: 'Product'                     // Many-to-many relationship
    }]
})

const Tag = new mongoose.Schema('Tag',tagSchema)
module.exports=Tag