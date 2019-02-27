

'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    topicId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Post.associate = function(models) {
    // associations can be defined here
    // PostDB is associated with Topics DB
    Post.belongsTo(models.Topic, {
      foreignKey: "topicId",
      onDelete: "CASCADE"
    });
    // Post DB is associated with User DB
    Post.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
    // PostDB is associated with CommentDB
    Post.hasMany(models.Comment, {
      foreignKey: "postId",
      as: "comments"
    });
    // PostDB assocaited with VoteDb
    Post.hasMany(models.Favorite, {
      foreignKey: "postId",
      as: "favorites"
    });
    Post.hasMany(models.Vote, {
      foreignKey: "postId",
      as: "votes"
    });
    Post.afterCreate((post, callback) => {
      return models.Favorite.create({
        userId: post.userId,
        postId: post.id
      });
    });
    Post.afterCreate((post, callback) => {
      return models.Vote.create({
        userId: post.userId,
        postId: post.id,
        value: 1
      });
    });
  };

  Post.prototype.getPoints = function(){
  // return 0 if there is no votes
    if(this.votes.length === 0) return 0
  // use map to transfer votes into array
  // we use reduce to get the vote number
    return this.votes
      .map((v) => { return v.value })
      .reduce((prev, next) => { return prev + next });
  };

  // check vote up
  Post.prototype.hasUpvoteFor = function(userId) {
    const foundUpvote = this.votes.filter((vote) => {
      return ((vote.value === 1) && (vote.userId === userId))
    });
    return foundUpvote.length === 1;
  };

  // check vote down
  Post.prototype.hasDownvoteFor = function(userId) {
    const foundDownvote = this.votes.filter((vote) => {
      return ((vote.value === -1) && (vote.userId === userId))
    });
    return foundDownvote.length === 1;
  }

  // check if favorite post is matching with userid
  Post.prototype.getFavoriteFor = function(userId){
    return this.favorites.find((favorite) => { return favorite.userId == userId });
  };


  // add scope to show last 5 posts from a user
  Post.addScope("lastFiveFor", (userId) => {
    // return implement query
        return {
          // find userId
          where: { userId: userId},
          // limit 5 posts
          limit: 5,
          // direction of search ( high - low))
          order: [["createdAt", "DESC"]]
        }
      });
  return Post;
};
