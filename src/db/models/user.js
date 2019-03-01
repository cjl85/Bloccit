'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: { msg: 'must be a valid email' }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "member"
    }
  }, {});
  User.associate = function(models) {
    // associations with Post DB
    User.hasMany(models.Post, {
      foreignKey: "userId",
      as: "posts"
    });
    // associations with Comment DB
    User.hasMany(models.Comment, {
      foreignKey: "userId",
      as: "comments"
    });
    // associations with VoteDB
    User.hasMany(models.Vote, {
      foreignKey: "userId",
      as: "votes"
    });
    // associations with FavoriteDB
    User.hasMany(models.Favorite, {
      foreignKey: "userId",
      as: "favorites"
    });
  };

  // return true if the user has a role of admin
  User.prototype.isAdmin = function() {
    return this.role === "admin";
  };
  return User;
};
