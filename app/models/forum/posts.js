const mongoose = require('mongoose');

const TopicPosts = mongoose.Schema({
    text      : String,
    postedBy  : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'User'
    },
    fromTopic : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'ThreadTopic'
    },
    createdAt : String,
    edited : {
        at : String,
        by : {
            firstName : String,
            lastName : String
        }
    }
});

module.exports = mongoose.model('TopicPosts', TopicPosts);