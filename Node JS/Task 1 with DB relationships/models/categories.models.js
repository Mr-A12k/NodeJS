const mongoose = require('mongoose')

const categorySchema =new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    products:[{
        type:mongoose.Schema.ObjectId,
        ref: 'Product'                        // One-to-many relationship
    }]
})

const Category = new mongoose.Schema('Category',categorySchema)
module.exports= Category