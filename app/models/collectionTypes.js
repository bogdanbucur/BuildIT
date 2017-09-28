const mongoose = require('mongoose');

let collectionTypesSchema = mongoose.Schema({
    user          : String,
    advancedBuild : String,
    beginnerBuild : String,
    case          : String,
    gpu           : String,
    hdd           : String,
    indexNews     : String,
    motherboard   : String,
    powerSupply   : String,
    cpu           : String,
    ram           : String,
    ssd           : String
});

collectionTypesSchema.pre('save', function(next){
    next();
});

module.exports = mongoose.model('CollectionTypes', collectionTypesSchema);