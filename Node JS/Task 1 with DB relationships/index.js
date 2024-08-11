const express = require('express')
const { default: mongoose } = require('mongoose')
const Product = require('./model/products.models.js')
const Category = require('./models/categories.models.js')
const Tag = require('./models/tags.models.js')
const app = express()

app.use(express.json())

app.listen(8000,()=>{
    console.log("server run on port 3000")
})

app.get('/',(req,res)=>{
    res.send("hello from node")
})

app.get('/api/products',async(req,res)=>{
        try {
            const product = await Product.find({}).populate('category').populate('tags')
            res.status(200).json(product)
        } catch (error) {
            res.status(500).json({message: error.message})
        }
});

app.get('/api/products/:id',async(req,res)=>{
        try {
           const {id} = req.params
           const product = await Product.findById(id).populate('category').populate('tags')
            res.status(200).json(product)
        } catch (error) {
            res.status(500).json({message: error.message})
        }
})

app.post('/api/product',async(req,res)=>{
    try {
       const product=await Product.create(req.body)
       if(req.body.category){
         await Category.findByIdAndUpdate(req.body.category,{$push:{products:product._id}})
         await Tag.updateMany({_id:{$in:req.body.tags}},{$push:{products:product._id}})
       }
       console.log("Product created")
       return res.status(200).json(product)
   } catch (error) {
      return res.status(500).json({message: "Product not found!"})
   }
    console.log(req.body)
})

app.post('/api/category', async (req, res) => {
    try {
        const category = await Category.create(req.body)
        console.log("Category created")
        return res.status(200).json(category)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

pp.post('/api/tag', async (req, res) => {
    try {
        const tag = await Tag.create(req.body)
        console.log("Tag created")
        return res.status(200).json(tag)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
});

//update product
app.put('/api/product/:id',async(req,res)=>{
    try {
        const {id}=req.params
        const product = await Product.findByIdAndUpdate(id, req.body, { new: true });

        if(!product){
            res.status(404).json({message:"Product not found"})
        }
        const updatedProduct=await Product.findByIdAndUpdate(id)
        res.status(200).json(updatedProduct)
    } catch (error) {
        res.status(500).json({message:"Product not found"})
    }
})

//delete item by id
app.delete('/api/product/:id', async(req,res)=>{
    try { 

        const {id} = req.params

        const product = await Product.findByIdAndDelete(id)

        if(!product){
            res.status(404).json({message:"Product not found"})
        }
        
        res.status(200).json({message:"Product deleted successfully"})
        
    } catch (error) {
        res.status(404).json({message:"Product not found!"})
    }

    
})

mongoose.connect("mongodb+srv://arunkapilm:lPXbjdvGx8M8G6YS@backenddb.tj7a23h.mongodb.net/Node-API?retryWrites=true&w=majority&appName=backendDB")
.then(()=>
{
    console.log("Connected to database")
}
)
.catch(()=>{
    console.log("Connection failed")
}
)