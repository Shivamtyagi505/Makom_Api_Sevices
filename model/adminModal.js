const mongoose = require('mongoose');
const Schema = mongoose.Schema;


/*** Admin Schema ***/
const AdminSchema = new Schema({
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
    fcm_token:{
        type:String
    },
    type:{
        type:String,
    },
}, {
    timestamps: true,
});
module.exports = mongoose.model("Admin", AdminSchema);