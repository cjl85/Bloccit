const Post = require("./models").Post;
const Topic = require("./models").Topic;

module.exports = {

  updatePost(req, updatedPost, callback){

  // #1
       return Post.findById(req.params.id)
       .then((post) => {

  // #2
         if(!post){
           return callback("Post not found");
         }

  // #3
         const authorized = new Authorizer(req.user, post).update();

         if(authorized) {

  // #4
           post.update(updatedPost, {
             fields: Object.keys(updatedTopic)
           })
           .then(() => {
             callback(null, post);
           })
           .catch((err) => {
             callback(err);
           });
         } else {

  // #5
           req.flash("notice", "You are not authorized to do that.");
           callback("Forbidden");
         }
       });
     }
