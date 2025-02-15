import { Sequelize } from 'sequelize';
import path from 'path';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '..', '..', 'database.sqlite'),
  logging: false,
});

export async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // Synchronize models to the database
    console.log('Database connected and models synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

export default sequelize;
