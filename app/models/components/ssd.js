const mongoose = require('mongoose');

const ssdSchema = new mongoose.Schema({

    image0            : String,
    image1            : String,
    image2            : String,
    image3            : String,
    name              : String,
    description       : String,
    formFactor        : String,
    capacity          : String,
    readTransferRate  : String,
    writeTransferRate : String,
    sataTransferRate  : String,
    other             : String,
    type              : String,
    rating            : String,
    price             : String,
    colType           : String
});

module.exports = mongoose.model('SSD', ssdSchema);