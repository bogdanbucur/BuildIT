const mongoose = require('mongoose');

const computerCasesSchema = new mongoose.Schema({

    image0                   : String,
    image1                   : String,
    image2                   : String,
    image3                   : String,
    name                     : String,
    description              : String,
    type                     : String,
    fans                     : String,
    material                 : String,
    powerSupply              : String,
    motherboardCompatibility : String,
    sidePanelWindow          : String,
    led                      : String,
    includedFans             : String,
    exteriorSlots            : String,
    interiorSlots            : String,
    other                    : String,
    size                     : String,
    price                    : String,
    rating                   : String,
    colType                  : String
});

module.exports = mongoose.model('ComputerCases', computerCasesSchema);