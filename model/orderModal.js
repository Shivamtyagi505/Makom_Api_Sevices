const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//location schema
const PlaceSchema = new Schema({
    "lat":{
        type:Number,
        required:true
    },
    "long":{
        type:Number,
        required:true
    },
    "address":{
        type:String, 
    },
});
module.exports = mongoose.model("Place",PlaceSchema);

/*** Order Schema ***/
const OrderSchema = new Schema({
    orderid:{
        type:String,
        required:true
    },
    receivername: {
        type: String,
        required: true,
    }, 
    sellerid: {
        type: String,
        required: true,
    },
    receiverphone: {
        type: String,
        required: true,
    },
    payment: {
        type: String,
        required: true,
    },
    assignedto:{
        type:String
    }, 
    status:{
        type:String,
        required:true,
    },
    products:{
        type:[String],
    },
    currentlocation: {
        type: PlaceSchema,
    },
    pickofflocation: {
        type: PlaceSchema,
        required: true,
    },
    destinationlocation: {
        type: PlaceSchema,
        required: true,
    },

}, {
    timestamps: true,
});
module.exports = mongoose.model("Order", OrderSchema);
