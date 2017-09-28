let mongoose = require('mongoose');

let graphicsBoardsSchema = new mongoose.Schema({

    image0                  : String,
    image1                  : String,
    image2                  : String,
    image3                  : String,
    name                    : String,
    description             : String,

    generalSlot             : String,
    generalGPU              : String,
    generalType             : String,
    generalMaxRes           : String,
    generalSLI              : String,

    cpuChipset              : String,
    cpuSeries               : String,
    cpuTechnology           : String,
    cpuFreq                 : String,

    memoryCapacity          : String,
    memoryType              : String,
    memoryBUS               : String,
    memoryFreq              : String,

    connectivityDisplayPort : String,
    connectivityDVI         : String,
    connectivityHDMI        : String,

    coolingType             : String,
    coolingCooler           : String,

    price                   : String,
    rating                  : String,
    mark                    : String,
    markPercentage          : String,
    colType                 : String
});

module.exports = mongoose.model('GraphicsBoards', graphicsBoardsSchema);