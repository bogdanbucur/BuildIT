const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

let userSchema = mongoose.Schema({

    local: {
        username : String,
        password : String
    },
    data: {
        oauthID      : String,
        firstName    : String,
        lastName     : String,
        email        : String,
        accountType  : String,
        userType     : String,
        registerType : String,
        image        : String,
        createdAt    : String,
        deletedAt    : String,
        builds : [
            {
                name : String,
                id   : String
            }
        ],
        laptops : [{
            type : mongoose.Schema.Types.ObjectId,
            ref  : 'Laptop'
        }],
        desktops : Array
    },
    colType : String
});

userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);