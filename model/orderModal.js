const mongoose = require('mongoose');
const Schema = mongoose.Schema;


/*** Admin Schema ***/
const OrderSchema = new Schema({
    orderid:{
        type:String,
        required:true
    },
    driverid: {
        type: String,
        unique: true,
        required: true,
    },
    receivername: {
        type: String,
        required: true,
    }, 
    sellerid: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    payment: {
        type: String,
        required: true,
    },
    currentlocation: {
        type: String,
        required: true,
    },
    pickofflocation: {
        type: String,
        required: true,
    },
    destinationlocation: {
        type: String,
        required: true,
    },

}, {
    timestamps: true,
});
module.exports = mongoose.model("Order", OrderSchema);