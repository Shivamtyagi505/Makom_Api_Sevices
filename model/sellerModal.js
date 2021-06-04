const mongoose = require('mongoose');
const Schema = mongoose.Schema;


/*** Seller Schema ***/
const SellerSchema = new Schema({
    uuid:{
        type:String, 
    },
    phone:{
        type:String,
        unique:true, 
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    address:{
        type:String, 
    },
    city:{
        type:String,
    },
    state:{
        type:String
    }, 
}, {
    timestamps: true,
  });
  module.exports=mongoose.model("Seller",SellerSchema);