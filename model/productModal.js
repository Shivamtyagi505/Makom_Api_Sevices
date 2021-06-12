const mongoose = require('mongoose');
const Schema = mongoose.Schema;

 
/*** Product Schema ***/
const ProductSchema = new Schema({
    product_id:{
        type:String,
        required:true
    },
    product_name: {
        type: String,
        required: true,
    }, 
    product_category: {
        type: String,
        required: true,
    },
    product_price: {
        type: String,
        required: true,
    },
    product_weight: {
        type: String,
        required: true,
    },
    delivery_type: {
        type: String,
        required: true,
    }, 


}, {
    timestamps: true,
});
module.exports = mongoose.model("Product", ProductSchema);
