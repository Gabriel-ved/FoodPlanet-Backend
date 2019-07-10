const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const Product = mongoose.model('Product');
module.exports ={
    async list(req,res){
        try{
            const stores = await Store.find().populate('products');
        
            return res.send({stores})
        }catch(err){
            return res.status(400).send({error:"Erro loading stores"})
        }
    },
    async listId(req,res){
        try{
            const store = await Store.findById(req.params.storeId);

            return res.send({store})
        }catch(err){
            return res.status(400).send({error:"Erro loading store"})
        }
    },    
    async listProducts(req,res){
        try{
            const products = await Product.find().populate('soldBy');

            return res.send({products})
        }catch(err){
            return res.status(400).send({error:"Erro loading products"})
        }
    },
    async IdProduct(req,res){
        try{
            const product = await Product.findById(req.params.productId).populate('soldBy');
            
            return res.send({product})
        }catch(err){
            return res.status(400).send({error:"Erro loading product"})
        }
    },
    async createProduct(req,res){
        try{
            const { products } = req.body
            const store = await Store.findById(req.userId,{new:true}).select("+password");
            
            await Promise.all(products.map(async product =>{
                const producP = new Product({ ...product,soldBy :req.userId});
            
                await producP.save();

                store.products.push(producP)
                
            }))
            await store.save();
            store.password = undefined;
            return res.send({store})
        }catch(err){
            console.log(err)
            return res.status(400).send({error:"Erro creating product"})
        }
    },
    async deleteProduct(req,res){
        try{
            const store = await Store.findById(req.userId);
            if(store != null){
                await Product.findByIdAndRemove(req.params.productId);

                return res.send()
            }
            return res.status(400).send({error:"Token invalid"})
        }catch(err){
            return res.status(400).send({error:"Erro deleting product"})
        }
    }
} 
