'use strict';
module.exports = (sequelize, DataTypes) => {
  const tracks = sequelize.define('Tracks', {
    title: DataTypes.STRING,
    key: DataTypes.STRING,
    authorId: DataTypes.INTEGER,
    url: DataTypes.STRING,
    length: DataTypes.INTEGER,
    lengthStr: DataTypes.STRING,
  }, {});
  tracks.associate = function(models) {
    // associations can be defined here
  };
  return tracks;
};
