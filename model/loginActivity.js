const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
    device:{
        type:String,
     },
     type:{
        type:String,
     }, 
    ipaddress: {
        type: String,
     },
     email: {
        type: String,
     },
     name: {
        type: String,
     },
     uuid: {
        type: String,
     },
}, {
    timestamps: true,
});
module.exports = mongoose.model("LoginActivity", ActivitySchema);
