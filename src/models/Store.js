const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');//encryptar a senha

const StoreSchema = new mongoose.Schema({//criando o Objeto q e a Store
    name: {
        type: String,
        required: true,
        unique:true
    },
    cnpj:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    date: {
        type: Date,
        default: Date.now 
    },
    local:{
        street:String,
        City:String,
        state:String,
        cep:String
    },
    products:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
    }],
    employee:[{
        name:String,
        cpf:String,
        date:{
            type: Date,
            default: Date.now   
        },
        sector:String,
        salary:Number
    }]
});

StoreSchema.pre('save', async function(next){//antes de salvar ele vai encryptar a senha
    const hash = await bcryptjs.hash(this.password, 10);
    this.password = hash;

    next();
})

mongoose.model('Store',StoreSchema);//setando o StoreSchema como modelo com nome "Store"
