var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
    photoID: Number,
    title: String,
    image: String,
    
});

module.exports = mongoose.model("Plant", UserSchema);