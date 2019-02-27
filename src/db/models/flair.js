'use strict';
module.exports = (sequelize, DataTypes) => {
  var Flair = sequelize.define('Flair', {

    name: {
      allowNull: false,
      type: DataTypes.STRING
    },

    color: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {});
  Flair.associate = function(models) {
    // associations can be defined here
  };
  return Flair;
};
