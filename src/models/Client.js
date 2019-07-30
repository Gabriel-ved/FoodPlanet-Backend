const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const ClientSchema = new  mongoose.Schema({//criando o Objeto/modelo/Schema do client
    name:{
        type:String,
        required:true,
        unique:true,
    },
    cpf:{
        type:String,
        required:true,
        unique:true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    photoName:String,
    date: {
        type: Date,
        default: Date.now 
    },
    local:{
        street:String,
        City:String,
        state:String,
        cep:String
    }
})

ClientSchema.pre("save", async function(next){//antes de salvar vai encryptar a senha
    const hash = await bcryptjs.hash(this.password, 10);
    this.password = hash;

    next();
})

mongoose.model('Client',ClientSchema);//setando o modelo ClientSchema com o nome "Client"
