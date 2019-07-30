const express = require('express');//backend framework for nodejs
const mongoose = require('mongoose');//mongodb framework
const requireDir = require('require-dir');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');


//Iniciando o app
const app = express();//iniciando o framework
app.use(cors())
app.use(express.json());//para o express aceitar post com json
app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'))
app.use('/files',express.static(path.resolve(__dirname,'tmp','upload')))

//Iniciando o banco de dados
mongoose.connect(//conectando ao banco de dados mongo
    "mongodb+srv://fpdeploy:fooddeploy@teste-b8h6q.mongodb.net/test?retryWrites=true&w=majority",
    {useNewUrlParser:true}
);

requireDir('./src/models');//importando todos os modelos da pasta /models

app.options('*', cors())//ativar o Pre-Flight

//Rotas
app.use('/', require('./src/Routes'));//referenciando o arquivo q tem todas as rotas

app.listen(process.env.PORT || 3000);//porta q vai ser usada

