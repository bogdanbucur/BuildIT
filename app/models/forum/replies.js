const mongoose = require('mongoose');

const commentReplySchema = mongoose.Schema({
    text : String,
    postedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'User'
    },
    ofComment : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'TopicComments'
    }
});

module.exports = mongoose.model('CommentReply', commentReplySchema);