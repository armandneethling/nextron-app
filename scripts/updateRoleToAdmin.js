const { sequelize } = require('../utils/database');
const defineUserModel = require('../models/User');

const User = defineUserModel(sequelize);

const updateRoleToAdmin = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (user) {
      user.role = 'admin';
      await user.save();
      console.log('User role updated to admin successfully');
    } else {
      console.log('User not found');
    }
  } catch (error) {
    console.error('Error updating user role:', error);
  }
};

updateRoleToAdmin('admin');
