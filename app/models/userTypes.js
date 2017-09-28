const mongoose = require('mongoose');

let userTypesSchema = new mongoose.Schema({
    
    types       : Array,
    colType     : String
});

module.exports = mongoose.model('UserTypes', userTypesSchema);