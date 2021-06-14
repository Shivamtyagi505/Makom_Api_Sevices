const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
    uuid:{
        type:String,
        required:true
    },
    device:{
        type:String,
        required:true
    },
    name: {
        type: String,
        unique: true,
        required: true,
    },
    ipaddress: {
        type: String,
        required: true,
    }, 
    time: {
        type: String,
        required:true
    },
}, {
    timestamps: true,
});
module.exports = mongoose.model("Activity", ActivitySchema);

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
    activity:{
        type:ActivitySchema,
        required:true,
    }
}, {
    timestamps: true,
});
module.exports = mongoose.model("Seller", SellerSchema);