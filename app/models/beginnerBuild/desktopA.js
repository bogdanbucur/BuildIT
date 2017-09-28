const mongoose = require('mongoose');

const desktopASchema = new mongoose.Schema({
    mainImage0               : String,
    mainImage1               : String,
    mainImage2               : String,
    mainImage3               : String,
    mainName                 : String,

    cpuModel                 : String,
    cpuArchitecture          : String,
    cpuCores                 : String,
    cpuFrequency             : String,
    cpuTurboBoost            : String,
    cpuGpu                   : String,

    boardPorts               : String,
    boardGpu                 : String,
    boardSound               : String,

    memoryCapacity           : String,
    memoryType               : String,
    memoryFrequency          : String,

    hddType                  : String,
    hddCapacity              : String,

    connectivityWireless     : String,
    connectivityLan          : String,
    connectivityBluetooth    : String,

    otherSize                : String,
    otherWeight              : String,
    otherSpecial             : String,

    lastOs                   : String,
    lastPrice                : String,
    desktopType              : String
});

module.exports = mongoose.model('DesktopA', desktopASchema);
