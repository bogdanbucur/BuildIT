const mongoose = require('mongoose');

const laptopSchema = new mongoose.Schema({
    mainImage0               : String,
    mainImage1               : String,
    mainImage2               : String,
    mainImage3               : String,
    mainImageDesc            : String,
    mainName                 : String,

    cpuBrand                 : String,
    cpuType                  : String,
    cpuArchitecture          : String,
    cpuCache                 : String,
    cpuTechnology            : String,
    cpuCores                 : String,
    cpuFrequency             : String,
    cpuTurboBoost            : String,
    cpuGpu                   : String,

    displayType              : String,
    displaySize              : String,
    displayResolution        : String,
    displayFormat            : String,
    displaySpecial           : String,

    memoryCapacity           : String,
    memoryType               : String,
    memoryFrequency          : String,

    hddType                  : String,
    hddCapacity              : String,

    gpuType                  : String,
    gpuBrand                 : String,
    gpuSeries                : String,

    multimediaOpticDrives    : String,
    multimediaAudio          : String,
    multimediaWebCamera      : String,
    multimediaCardReader     : String,
    multimediaSupCards       : String,

    portsAudio               : String,
    portsHDMI                : String,
    portsUsb                 : String,
    portsThunderbolt         : String,

    connectivityWireless     : String,
    connectivityBluetooth    : String,

    powerBattery             : String,
    powerTime                : String,

    otherSize                : String,
    otherWeight              : String,
    otherMaterial            : String,
    otherColor               : String,
    otherKeyboard            : String,
    otherNumeric             : String,
    otherLight               : String,
    otherSpecial             : String,
    otherOther               : String,

    lastOs                   : String,
    lastPrice                : String
});

module.exports = mongoose.model('Laptop', laptopSchema);