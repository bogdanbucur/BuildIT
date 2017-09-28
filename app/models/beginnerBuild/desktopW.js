const mongoose = require('mongoose');

const desktopWSchema = new mongoose.Schema({
    computerCase  : String,
    graphicsBoard : String,
    hardDrive     : String,
    motherboard   : String,
    powerSupply   : String,
    processor     : String,
    ramMemory     : String,
    ssd           : String,
    desktopType   : String
});

module.exports = mongoose.model('DesktopW', desktopWSchema);