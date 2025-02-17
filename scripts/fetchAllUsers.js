const { sequelize } = require('../utils/database');
const defineUserModel = require('../models/User');

const User = defineUserModel(sequelize);

const fetchAllUsers = async () => {
  try {
    const users = await User.findAll();
    console.log('Registered Users:');
    users.forEach(user => {
      console.log(`ID: ${user.id}, Username: ${user.username}, Role: ${user.role}`);
    });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// Call the function to fetch all users
fetchAllUsers();
