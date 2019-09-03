const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const Product = mongoose.model('Product');
module.exports ={
    async list(req,res){
        try{
            const stores = await Store.find();

            return res.send({stores})
        }catch(err){
            return res.status(400).send({error:"Erro loading stores"})
        }
    },
    async listId(req,res){
        try{
            const store = await Store.findById(req.params.storeId).populate('products');

            return res.send({store})
        }catch(err){
            return res.status(400).send({error:"Erro loading store"})
        }
    },
    async listProducts(req,res){
        try{
            const { page } = req.query;
            const options = {
                page: parseInt(page,10)||1,
                limit: 6
            }
            const products = await Product.paginate({},options);
            return res.json(products)

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
            const { products } = req.body;
            let newProducts = [];
            await Promise.all(products.map(async product =>{
                const producP = new Product({
                    ...product,
                    soldBy :req.userId
                });
                await producP.save();
                newProducts.push(producP)
            }))
            const store = await Store.findByIdAndUpdate(req.userId,{
              products:[...products,...newProducts]
            },{new:true}).select("+password");
            store.password = undefined;
            return res.send({newProducts})
        }catch(err){
            console.log(err)
            return res.status(400).send(err)
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
    },
    async uploadImgProduct(req,res){
        const { filename } =req.file;
        try{
            const product = await Product.findByIdAndUpdate(
                req.params.productId,
                {
                    photoName:filename,
                    url:`https://storage.googleapis.com/foodplanet-imagens/${filename}`
                },
                {new:true}
                );
            await product.save();
            return res.send({product})
        }catch(err){
            return res.status(400).send({error:"Erro uploading img product"})
        }
    },
    async updateProduct(req,res){
      try{
        const product = await Product.findByIdAndUpdate(
          req.params.productId,
          {
            ...req.body
          },
          {new:true}
        );
        await product.save();
        return res.send({product})
      }catch(err){
        return res.status(400).send({error:"Erro updating product"})
      }
    }
}
