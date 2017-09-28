let mongoose = require('mongoose');

let motherBoardsSchema = new mongoose.Schema({

    image0                   : String,
    image1                   : String,
    image2                   : String,
    image3                   : String,
    name                     : String,
    description              : String,
    cpuSocket                : String,
    cpuChipset               : String,
    cpuSupported             : String,
    memoryType               : String,
    memoryMaxCapacity        : String,
    memoryFreq               : String,
    memoryDualSupport        : String,
    memorySlots              : String,
    connectivityPCI          : String,
    connectivityAudio        : String,
    connectivityLAN          : String,
    connectivityATA          : String,
    connectivityTransferRate : String,
    connectivityUSB2         : String,
    connectivityUSB3         : String,
    connectivityCon          : String,
    slotsPCIx16              : String,
    slotsPCIx1               : String,
    otherFormat              : String,
    otherSize                : String,
    rating                   : String,
    price                    : String,
    mark                     : String,
    markPercentage           : String,
    colType                  : String,
});

module.exports = mongoose.model('MotherBoards', motherBoardsSchema);