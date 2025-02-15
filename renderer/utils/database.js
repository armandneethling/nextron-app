// renderer/utils/database.js

import { Sequelize } from 'sequelize';
import path from 'path';

// Create the Sequelize instance
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(process.cwd(), 'database.sqlite'), // Adjust the path as needed
  logging: false,
});

// Import your models
import Video from '../models/Video';

// Initialize the database
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Database connected and models synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

export default sequelize;
export { Video };
