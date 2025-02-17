const { sequelize } = require('../utils/database');
const defineUserModel = require('../models/User');

const User = defineUserModel(sequelize);

const updateRoleToAdminById = async (userId) => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    const user = await User.findByPk(userId);
    if (user) {
      user.role = 'admin';
      await user.save();
      console.log(`User role updated to admin for user ID: ${user.id}`);
    } else {
      console.log('User not found');
    }
  } catch (error) {
    console.error('Error updating user role:', error);
  } finally {
    await sequelize.close();
  }
};

updateRoleToAdminById('');
