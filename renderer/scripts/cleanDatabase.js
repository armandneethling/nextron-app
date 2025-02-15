const { sequelize } = require('../utils/database');
const defineVideoModel = require('../models/Video');

const Video = defineVideoModel(sequelize);

async function cleanDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    await Video.destroy({ where: {}, truncate: true });
    console.log('All video entries have been deleted.');
  } catch (error) {
    console.error('Error cleaning the database:', error);
  } finally {
    await sequelize.close();
  }
}

cleanDatabase();

console.log('Database cleaned successfully.');