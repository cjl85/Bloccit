const User = require("./models").User;
const bcrypt = require("bcryptjs");
const Post = require("./models").Post;
const Comment = require("./models").Comment;

module.exports = {
// #2
  createUser(newUser, callback){

// #3
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

// #4
    return User.create({
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  }

  getUser( id, callback ) {

    User.scope("favoritePosts").findById(id)
    .then((user) => {
      if (!user) {callback(404);}
      else {
        console.log(user.favorites);

            Favorite.scope({method: ["favoritedBy", id]}).findAll()
            .then((favorites) => {
              console.log(favorites);

              callback(null, {user, posts, comments, favorites})
            })
            .catch((err) => {callback(err);})
          });
        });
      }
    });
  }

}
