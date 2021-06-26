const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
/*** Seller Schema ***/
const SellerSchema = new Schema({
    uuid: {
        type: String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    phone: {
        type: String,
        required:true
    },
    products:{
        type:[String],
    },
    city: {
        type: String,
        required:true
    },
    orders:{
        type:[String]
    },
    state: {
        type: String,
        required:true
    },   
    isverified:{
        type: Boolean,
        required:true
    },
    isblocked:{
        type:Boolean,
        required:true,
    }, 
    isAutomaticDelivery:{
        type:Boolean,
        required:true,
    }, 
    fcm_token:{
        type:String
    },
    payment_threshold:{
        type:Number
    }
}, {
    timestamps: true,
});
module.exports = mongoose.model("Seller", SellerSchema);