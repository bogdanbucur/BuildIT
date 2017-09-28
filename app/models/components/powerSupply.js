let mongoose = require('mongoose');

let powerSupplySchema = new mongoose.Schema({

    image0        : String,
    image1        : String,
    image2        : String,
    image3        : String,
    name          : String,
    description   : String,
    power         : String,
    fans          : String,
    powerSocket   : String,
    special       : String,
    connectors    : String,
    modularSource : String,
    format        : String,
    other         : String,
    size          : String,
    rating        : String,
    price         : String,
    colType       : String
});

module.exports = mongoose.model('PowerSupply', powerSupplySchema);