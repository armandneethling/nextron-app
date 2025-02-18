'use strict';

const Sequelize = require('sequelize');
const process = require('process');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(
    process.env[config.use_env_variable],
    config
  );
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

const defineReviewModel = require('./Review');
const defineReplyModel = require('./Reply');
const defineVideoModel = require('./Video');

db.Review = defineReviewModel(sequelize, Sequelize.DataTypes);
db.Reply = defineReplyModel(sequelize, Sequelize.DataTypes);
db.Video = defineVideoModel(sequelize, Sequelize.DataTypes);

db.Video.hasMany(db.Review, { foreignKey: 'videoId', as: 'reviews' });
db.Review.belongsTo(db.Video, { foreignKey: 'videoId', as: 'video' });

db.Review.hasMany(db.Reply, { foreignKey: 'reviewId', as: 'replies' });
db.Reply.belongsTo(db.Review, { foreignKey: 'reviewId', as: 'review' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;