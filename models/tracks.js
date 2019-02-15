'use strict';
module.exports = (sequelize, DataTypes) => {
  const tracks = sequelize.define('tracks', {
    title: DataTypes.STRING,
  }, {});
  tracks.associate = function(models) {
    // associations can be defined here
  };
  return tracks;
};