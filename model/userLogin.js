const mongoose = require('mongoose');
const Schema = mongoose.Schema;


/*** All User Login Schema ***/
const UserSchema = new Schema({
    uuid: {
        type: String,
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
}, {
    timestamps: true,
});
module.exports = mongoose.model("User", UserSchema);