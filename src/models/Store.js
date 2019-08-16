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
    photoName:String,
    url:String,
    date: {
        type: Date,
        default: Date.now 
    },
    local:{
        street:{
            type:String
        },
        city:{
            type:String
        },
        state:{
            type:String
        },
        cep:{
            type:String
        }
    },
    products:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
    }]
});

StoreSchema.pre('save', async function(next){//antes de salvar ele vai encryptar a senha
    const hash = await bcryptjs.hash(this.password, 10);
    this.password = hash;

    next();
})

mongoose.model('Store',StoreSchema);//setando o StoreSchema como modelo com nome "Store"
