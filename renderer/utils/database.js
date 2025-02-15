import { Sequelize } from 'sequelize';
import path from 'path';

const databasePath = path.resolve(__dirname, '..', '..', 'database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: databasePath,
  logging: console.log,
});

import '../models/Video';

export async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    await sequelize.authenticate();
    console.log('Database authenticated.');
    await sequelize.sync();
    console.log('Database synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

export default sequelize;