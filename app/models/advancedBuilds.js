const mongoose = require('mongoose');

let advancedBuildsSchema = mongoose.Schema({
    ofUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
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

module.exports = mongoose.model('AdvancedBuilds', advancedBuildsSchema);