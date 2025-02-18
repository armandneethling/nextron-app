const { sequelize } = require('../utils/database');
const defineUserModel = require('../models/User');

const User = defineUserModel(sequelize);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    const users = await User.findAll();
    console.log('Registered Users:');
    users.forEach(user => {
      console.log(`ID: ${user.id}, Username: ${user.username}, Role: ${user.role}`);
    });

    setTimeout(async () => {
      try {
        await sequelize.close();
        console.log('Database connection closed successfully.');
      } catch (closeError) {
        console.error('Error closing the database connection:', closeError);
      }
    }, 1000);
  } catch (error) {
    console.error('Unable to connect to the database:', error);

    if (sequelize) {
      try {
        await sequelize.close();
        console.log('Database connection closed after error.');
      } catch (closeError) {
        console.error('Error closing the database connection after error:', closeError);
      }
    }
  }
})();
