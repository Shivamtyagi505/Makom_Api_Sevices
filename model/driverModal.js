const mongoose = require('mongoose');
const Schema = mongoose.Schema;


/*** Driver Schema ***/
const DriverSchema = new Schema({
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
    phone: {
        type: String,
        required:true
    },
    orders:{
        type:[String]
    },
    city: {
        type: String,
        required:true
    },
    state: {
        type: String,
        required:true
    },   
    isblocked:{
        type:Boolean,
        required:true,
    },
}, {
    timestamps: true,
});
module.exports = mongoose.model("Driver", DriverSchema);