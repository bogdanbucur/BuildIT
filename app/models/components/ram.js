const mongoose = require('mongoose');

const ramSchema = new mongoose.Schema({

    image0           : String,
    image1           : String,
    image2           : String,
    image3           : String,
    name             : String,
    description      : String,
    generalType      : String,
    generalStandard  : String,
    generalCapacity  : String,
    generalFrequency : String,
    generalModule    : String,
    otherLatency     : String,
    otherRadiator    : String,
    otherVoltage     : String,
    rating           : String,
    price            : String,
    colType          : String
});

module.exports = mongoose.model('RAM', ramSchema);