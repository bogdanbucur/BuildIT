const mongoose = require('mongoose');

const threadTopicSchema = mongoose.Schema({
    title       : String,
    description : String,
    archived    : Boolean,
    archivedAt  : String,
    createdAt   : String,
    updatedAt   : String,
    fromThread : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'Thread'
    },
    postedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'User'
    },
    posts : [{
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'TopicPosts'
    }]
});

module.exports = mongoose.model('ThreadTopic', threadTopicSchema);