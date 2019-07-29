const jwt = require('jsonwebtoken');//Token
const authConfig = require('../config/auth.json');//"senha" do projeto

module.exports = (req,res,next) =>{
    const authHeader = req.headers.authorization//receber o token(Bearer token)

    if(!authHeader)//se não tiver o titulo
        return res.status(401).send({error:"No token provided"})
    const parts = authHeader.split(' ');//separar o Bearer do token

    if(!parts.length ===2)//verificar se tem 2 conteudo
        return res.status(401).send({error:"Token error"})
    
    const [ scheme, token ]= parts;//scheme = Bearer, token= token

    if(!/^Bearer$/i.test(scheme))//Regex verificar se existe no !começo! o Bearer 
        return res.status(401).send({error:"Token malformatted"})

    jwt.verify(token, authConfig.secret , (err,decoded)=>{//descryptografar o token junto com a "senha" do projeto
        if(err) return res.status(401).send({error:"Token invalid"})

        req.userId = decoded.id;//retorna o userId se o token estiver correto
        return next();
    })
    
}