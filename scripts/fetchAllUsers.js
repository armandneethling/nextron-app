const { sequelize } = require('../utils/database');
const defineUserModel = require('../models/User');

const User = defineUserModel(sequelize);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Fetch all users
    const users = await User.findAll();
    console.log('Registered Users:');
    users.forEach(user => {
      console.log(`ID: ${user.id}, Username: ${user.username}, Role: ${user.role}`);
    });

    // Close the connection only after fetching and logging users
    await sequelize.close();
    console.log('Database connection closed successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);

    // Ensure the connection is closed even if an error occurs
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
