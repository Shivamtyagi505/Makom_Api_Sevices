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
    receiver: {
        type: {},
        required: true,
    }, 
    seller: {
        type: {},
        required: true,
    }, 
    assignedto:{
        type:{}
    }, 
    status:{
        type:String,
        required:true,
    },
    secretcode:{
        type:String,
    },
    products:{
        type:[{}],
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
    }

}, {
    timestamps: true,
});
module.exports = mongoose.model("Order", OrderSchema);
