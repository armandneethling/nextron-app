const { Sequelize } = require('sequelize');
const path = require('path');
const os = require('os');

const dbPath = path.join(os.homedir(), '.myapp', 'database.sqlite');

const fs = require('fs');
const dirPath = path.dirname(dbPath);
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
});

module.exports = sequelize;
