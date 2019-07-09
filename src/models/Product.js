const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({//criando o Objeto q e a Store
        name:{
            type:String,
            required:true,
        },
        code:{
            type:Number,
            required:true,
            unique:true,
        },
        value:{
            type:Number,
            required:true
        },
        soldBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Store',
            required:true
        }
});

mongoose.model('Product',ProductSchema);//setando o StoreSchema como modelo com nome "Store"