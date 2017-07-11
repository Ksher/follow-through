const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  projectId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  agreed: false,
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
