const mongoose = require('mongoose');

const TopicComments = mongoose.Schema({
    text      : String,
    postedBy  : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'User'
    },
    fromTopic : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'ThreadTopic'
    },
    replies : [{
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'CommentReply'
    }]
});

module.exports = mongoose.model('TopicComments', TopicComments);