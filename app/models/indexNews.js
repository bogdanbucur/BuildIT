const mongoose = require('mongoose');

let indexNewsSchema = new mongoose.Schema({

    image       : String,
    title       : String,
    description : String,
    link        : String,
    colType     : String
});

module.exports = mongoose.model('IndexNews', indexNewsSchema);