const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema({
    type        : Number,
    title       : String,
    description : String,
    postedBy    : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'User'
    },
    topics      : [{
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'ThreadTopic'
    }],
    createdAt   : String,
    archived    : Boolean,
    archivedAt  : String
});

module.exports = mongoose.model('Thread', threadSchema);