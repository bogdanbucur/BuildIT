const mongoose = require('mongoose');

let beginnerBuildsSchema = mongoose.Schema({

    laptops  : {
        ids  : Array
    },
    colType  : String
});

beginnerBuildsSchema.pre('save', function(next){
    next();
});

module.exports = mongoose.model('BeginnerBuilds', beginnerBuildsSchema);