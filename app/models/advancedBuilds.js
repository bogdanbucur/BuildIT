const mongoose = require('mongoose');

let advancedBuildsSchema = mongoose.Schema({
    case        : String,
    gpu         : String,
    hdd         : String,
    motherboard : String,
    powerSupply : String,
    cpu         : String,
    ram         : String,
    ssd         : String,
    colType     : String
});

advancedBuildsSchema.pre('save', function(next){
    next();
});

module.exports = mongoose.model('AdvancedBuilds', advancedBuildsSchema);