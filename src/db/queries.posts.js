const Post = require("./models").Post;
const Topic = require("./models").Topic;
const Comment = require("./models").Comment;
const User = require("./models").User;
const Vote = require("./models").Vote;
const Favorite = require("./models").Favorite;

module.exports = {
    addPost(newPost, callback){
        return Post.create(newPost)
        .then((post) => {
          callback(null, post);
        })
        .catch((err) => {
          callback(err);
        })
    }, // addPost
    show(req, res, next){
        postQueries.getPost(req.params.id, (err, post) => {
          if(err || post == null){
            res.redirect(404, "/");
          } else {
            res.render("posts/show", {post});
          }
        });
    }, // show posts
    getPost(id, callback){
        // include commets and users
        return Post.findById(id, {
            include: [
              {model: Comment, as: "comments", include: [
                {model: User }
              ]},
              {model: Vote, as: "votes"},
              {model: Favorite, as: "favorites"}
            ]
        })
        .then((post) => {
          callback(null, post);
        })
        .catch((err) => {
          callback(err);
        })
    }, // get Post that you want to see
    deletePost(req, callback){
      return Post.findById(req.params.id)
        .then((post) => {
          const authorized = new Authorizer(req.user, post).destroy();
          // check if user is authorized
          if(authorized){
              post.destroy()
              .then((deletedRecordsCount) => {
                  callback(null, deletedRecordsCount);
              });
          } else {
              callback(401, null);
          }
        })
        .catch((err) => {
          callback(err);
      });
    }, // deletePost
    updatePost(req, updatedPost, callback){
      return Post.findById(req.params.id)
      .then((post) => {
          if(!post){
              return callback(404);
          }
          const authorized = new Authorizer(req.user, post).update();

          if(authorized) {
              post.update(updatedPost, {
                  fields: Object.keys(updatedPost)
              })
              .then(() => {
                  callback(null, post);
              })
              .catch((err) => {
                  callback(err);
              });
          } else {
              req.flash("notice", "You are not authorized to do that.");
              callback(403);
          }
      });
    }, // edit post
}
