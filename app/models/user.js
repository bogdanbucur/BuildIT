const mongoose = require('mongoose');
const bcrypt   = require('bcrypt-nodejs');

let userSchema = mongoose.Schema({

    local            : {
        username     : String,
        password     : String
    },
    facebook         : {
        id           : String,
        token        : String,
        name         : String,
        email        : String,
        image        : String,
        created      : String
    },
    github           : {
        oauthID      : String,
        name         : String,
        image        : String,
        created      : String
    },
    google           : {
        oauthID      : String,
        firstName    : String,
        lastName     : String,
        email        : String,
        image        : String,
        created      : String
    },
    instagram        : {
        oauthID      : String,
        username     : String,
        firstName    : String,
        lastName     : String,
        image        : String,
        created      : String
    },
    data             : {
        firstName    : String,
        lastName     : String,
        email        : String,
        accountType  : String,
        userType     : String,
        builds       : [
            {
                name : String,
                id   : String
            }
        ],
        laptops      : Array,
        desktops     : Array
    },
    colType          : String,
    deletedAt        : String
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);