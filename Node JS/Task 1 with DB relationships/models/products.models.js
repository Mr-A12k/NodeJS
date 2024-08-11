const mongoose  = require('mongoose')
const productScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    inStock: {
        type: Boolean,
        default: true
    },
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'                               // One-to-one relationship
    },
    // tags:[{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:'Tag'                                    // Many-to-many relationship
    // }]
})

const Product = mongoose.Schema('Product',productScheme)
module.exports = Product