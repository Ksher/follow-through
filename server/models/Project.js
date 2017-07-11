const mongoose = require('mongoose');
const Post = require('./Post');
const User = require('./User');
const oa = require('./../oauth/twitter');


const projectSchema = mongoose.Schema({
  users: {
    type: [mongoose.Schema.ObjectId],
    required: true,
  },
  posts: {
    type: [mongoose.Schema.Post],
    required: false,
  },
  post_date: {
    type: Date,
    required: false,
  },
  status: {
    type: String,
    required: true,
  },
  agreed: {
    type: [Boolean],
    required: true,
  }
});

projectSchema.methods.makePosts = function () {
  const project = this;
  const usersPromises = project.users.map((userId) => {
    return new Promise((resolve, reject) => {
      User.findOne({ _id: userId })
        .then(user => resolve(user))
        .catch(e => console.log(e));
    });
  });

  Promise.all(usersPromises).then(users => {
    users.forEach((user) => {
      const status = project.posts.find(post => post.ownerId.toString() === user._id.toString()).text;
      oa.post(
        'https://api.twitter.com/1.1/statuses/update.json',
        user.token,
        user.tokenSecret, { status },
        (e) => console.log(e),
      );
    });
  });
};

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
