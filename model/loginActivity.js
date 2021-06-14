const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
    device:{
        type:String,
     }, 
    ipaddress: {
        type: String,
     }, 
}, {
    timestamps: true,
});
module.exports = mongoose.model("LoginActivity", ActivitySchema);
