'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

const defineReviewModel = require('./Review');
const defineReplyModel = require('./Reply');
const defineVideoModel = require('./Video');

db.Review = defineReviewModel(sequelize);
db.Reply = defineReplyModel(sequelize);
db.Video = defineVideoModel(sequelize);

db.Video.hasMany(db.Review, { foreignKey: 'videoId', as: 'reviews' });
db.Review.belongsTo(db.Video, { foreignKey: 'videoId', as: 'video' });
db.Review.hasMany(db.Reply, { foreignKey: 'reviewId', as: 'reviewReplies' });
db.Reply.belongsTo(db.Review, { foreignKey: 'reviewId', as: 'review' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
