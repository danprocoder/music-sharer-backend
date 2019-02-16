'use strict';
module.exports = (sequelize, DataTypes) => {
  const tracks = sequelize.define('Tracks', {
    title: DataTypes.STRING,
    key: DataTypes.STRING,
    authorID: DataTypes.INTEGER,
  }, {});
  tracks.associate = function(models) {
    // associations can be defined here
  };
  return tracks;
};
