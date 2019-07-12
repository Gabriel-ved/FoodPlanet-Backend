const express = require('express');//backend framework for nodejs
const mongoose = require('mongoose');//mongodb framework
const requireDir = require('require-dir');
const cors = require('cors');

//Iniciando o app
const app = express();//iniciando o framework
app.use(express.json());//para o express aceitar post com json
app.use(express.urlencoded({extended:true}))
app.options("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.send(200);
});
//app.use(cors())
//Iniciando o banco de dados
mongoose.connect(//conectando ao banco de dados mongo
    "mongodb+srv://fpdeploy:fooddeploy@teste-b8h6q.mongodb.net/test?retryWrites=true&w=majority",
    {useNewUrlParser:true}
);

requireDir('./src/models');//importando todos os modelos da pasta /models

//Rotas
app.use('/', require('./src/Routes'));//referenciando o arquivo q tem todas as rotas

app.listen(process.env.PORT || 3000);//porta q vai ser usada

