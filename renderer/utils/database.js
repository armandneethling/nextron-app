import { Sequelize } from 'sequelize';
import path from 'path';
import defineVideoModel from '../models/Video.js';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(process.cwd(), 'database.sqlite'),
  logging: console.log,
});

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    defineVideoModel(sequelize);

    await sequelize.sync({ force: true });
    console.log('Database synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

const dbInitialized = initializeDatabase();

export { sequelize, dbInitialized };