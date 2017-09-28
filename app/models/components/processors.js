let mongoose = require('mongoose');

let processorSchema = new mongoose.Schema({

    image0         : String,
    image1         : String,
    image2         : String,
    image3         : String,
    name           : String,
    description    : String,
    cache          : String,
    socket         : String,
    frequency      : String,
    turboBoost     : String,
    operatingMode  : String,
    cores          : String,
    technology     : String,
    cacheL3        : String,
    cooler         : String,
    power          : String,
    rating         : String,
    price          : String,
    mark           : String,
    markPercentage : String,
    colType        : String
});

module.exports = mongoose.model('Processors', processorSchema);