const mongoose = require('mongoose');

const threadTopicSchema = mongoose.Schema({
    type        : Number,
    title       : String,
    description : String,
    archived    : Boolean,
    fromThread : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'Thread'
    },
    postedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'User'
    },
    comments : [{
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'TopicComments'
    }]
});

module.exports = mongoose.model('ThreadTopic', threadTopicSchema);