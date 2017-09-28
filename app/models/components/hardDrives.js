const mongoose = require('mongoose');

const hardDrivesSchema = new mongoose.Schema({

    image0                : String,
    image1                : String,
    image2                : String,
    image3                : String,
    name                  : String,
    description           : String,
    capacity              : String,
    speed                 : String,
    interface             : String,
    format                : String,
    cache                 : String,
    transferRate          : String,
    averageOperatingPower : String,
    price                 : String,
    rating                : String,
    colType               : String
});

module.exports = mongoose.model('HardDrives', hardDrivesSchema);