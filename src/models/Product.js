const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

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
        photoName:String,
        soldBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Store',
            required:true
        }
});
ProductSchema.plugin(mongoosePaginate);

mongoose.model('Product',ProductSchema);//setando o StoreSchema como modelo com nome "Store"