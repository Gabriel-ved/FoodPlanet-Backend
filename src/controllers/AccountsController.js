const mongoose = require('mongoose');
const Store = mongoose.model('Store');//modelo da Store
const Client = mongoose.model('Client');//modelo do Client
const bcryptjs = require('bcryptjs');//para cryptografar a senha
const jwt = require('jsonwebtoken');//criar um token
const authConfig = require('../config/auth.json');//senha do projeto

function generateToken(params = {}){//gerador de token
    return jwt.sign(params, authConfig.secret, {//o token e criado apartir do store.id ou client.id
        expiresIn:86400
    } )
}

module.exports = {
    async register(req,res){// metodo para a rota que registra Store ou Client
      const { cnpj } = req.body;
      const { cpf } = req.body;
      if(cnpj !== undefined){//verifica se o cnpj foi passado pelo json(req.body)
         try{
            if(await Store.findOne({ cnpj })){//verifica se ja existe cadastrado
                return res.status(400).send({ error:"Store already exist"})
            }
            const store = await Store.create(req.body);// cria uma Store

            store.password = undefined;//para não retornar a senha
            return res.send({
                store,
                token: generateToken({id:store.id})//retornar o token da Store criada
            });
        }catch(err){
            return res.status(400).send({ error:"Register failed"})
        }
      }
      if( cpf !== undefined ){// verifica se o cpf foi passado pelo json
        try{
            if(await Client.findOne({ cpf })){//verifica se ja existe cadastrado
                return res.status(400).send({ error:"Client already exist"})
            }
            const client = await Client.create(req.body);//cria um Client

            client.password = undefined;//não retorna a senha
            return res.send({
                client,
                token: generateToken({id:client.id})// retorna o token do Client
            });
        }catch(err){
            return res.status(400).send({ error:"Register failed"})
        }
      }
    return res.status(400).send({error:"Register ERROR"})
    },
    async auth(req,res){//metodo para a rota q verifica os token ("Login")
        const { cpf ,cnpj, password } = req.body;//recebe o cnpj e senha
        if(cnpj != undefined){
            try{
                const storeUser = await Store.findOne({ cnpj }).select("+password")//recebe Store do banco

                if(!storeUser)
                    return res.status(400).send({ errer:"store not found"})

                if(!await bcryptjs.compare(password, storeUser.password))//verifica se a senha esta certa
                    return res.status(400).send({ error:"invalid password"})

                storeUser.password = undefined;//para não retornar a senha

                res.send({ //retorna a conta e o token
                    storeUser,
                    token: generateToken({id:storeUser.id})
                })
            }catch(err){
                return res.status(400).send({"error":"Store authentication failed"})
            }
        }
        if(cpf != undefined){
            try{
                const clientUser = await Client.findOne({ cpf }).select("+password")

                 if(!clientUser)
                    return res.status(400).send("client not found")

                if(!await bcryptjs.compare(password , clientUser.password))
                    return res.status(400).send("invalid password")

                clientUser.password = undefined;

                res.send({
                    clientUser,
                    token: generateToken({id:clientUser.id})
                })
            }catch(err){
               return res.status(400).send("Client authentication failed")
            }
        }
    },
    async upload(req,res){
        if(await Store.findById(req.userId)){
            try{
                const { filename } = req.file;
                const store = await Store.findByIdAndUpdate(
                    req.userId,
                    {
                    photoName:filename,
                    url:`https://storage.googleapis.com/foodplanet-imagens/${filename}`
                    },
                    {new:true}).select("+password");
                    store.password = undefined;
                return res.send(JSON.stringify(store))
            }catch(err){
                return res.status(400).send({error:JSON.stringify(err)})
            }
        }
        if(await Client.findById(req.userId)){
            try{
                const { filename } = req.file;

                const client = await Client.findByIdAndUpdate(
                    req.userId,
                    {
                    photoName:filename,
                    url:`https://storage.googleapis.com/foodplanet-imagens/${filename}`
                    },
                    {new:true}).select("+password");
                    client.password = undefined;
                return res.send(JSON.stringify(client))
            }catch(err){
                return res.status(400).send({error:err})
            }
        }
        return res.status(400).send({error:"Upload ERROR"})
    },
    async update(req,res){
        if(await Store.findById(req.userId)){
            try{
                const store = await Store.findByIdAndUpdate(
                    req.userId,
                    {...req.body},
                {new:true})
                .select("+password");

                // if(products !== undefined){
                //     store.products =[];
                //     await Product.remove({ soldBy:req.userId })
                //     await Promise.all(products.map(async product =>{
                //         const producP = new Product({ ...product,soldBy :req.userId});
                //
                //         await producP.save();
                //
                //         store.products.push(producP)
                //     }))
                // }
                store.password = undefined;
                return res.send({store})
            }catch(err){
                return res.status(400).send({error:err})
            }
        }
        if(await Client.findById(req.userId)){
            try{
                const client = await Client.findByIdAndUpdate(
                    req.userId,
                    {...req.body},
                {new:true})
                .select("+password");
                client.password = undefined;
                return res.send({client})
            }catch(err){
                return res.status(400).send({error:"Client update failed"})
            }
        }
        return res.status(400).send({error:"Update ERROR"})
    },
    async delete(req,res){
        try{
            if(Store.findById(req.userId) != null){
                await Store.findByIdAndRemove(req.userId);
            }
            if(Client.findById(req.userId) != null){
                await Client.findByIdAndRemove(req.userId)
            }
            return res.send();
        }catch(err){
            return res.status(400).send({error:"Delete ERROR"})
        }
    },
    async list(req,res){
        try{
            const admin = await Client.findById(req.userId)
            const name = admin.name;
            if(name == "fenexs"){
                const clients = await Client.find();
                return res.status(200).send({clients})
            }
            return res.status(400).send({error:"list 2 ERROR (name stolen)"})
        }catch(err){
            return res.status(400).send({error:"list ERROR"})
        }
    }
};
