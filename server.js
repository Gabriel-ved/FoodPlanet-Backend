const express = require('express');//backend framework for nodejs
const mongoose = require('mongoose');//mongodb framework
const requireDir = require('require-dir');

//Iniciando o app
const app = express();//iniciando o framework
app.use(express.json());//para o express aceitar post com json
app.use(express.urlencoded({extended:true}))
//Iniciando o banco de dados
mongoose.connect(//conectando ao banco de dados mongo
    "mongodb+srv://fpdeploy:fooddeploy@teste-b8h6q.mongodb.net/test?retryWrites=true&w=majority",
    {useNewUrlParser:true}
);

requireDir('./src/models');//importando todos os modelos da pasta /models

//Rotas
app.use('/', require('./src/Routes'));//referenciando o arquivo q tem todas as rotas

app.listen(3001);//porta q vai ser usada

