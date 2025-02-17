const { sequelize } = require('../utils/database');
const defineUserModel = require('../models/User');

const User = defineUserModel(sequelize);

const fetchUserIdByUsername = async (username) => {
  try {
    const user = await User.findOne({ where: { username } });
    if (user) {
      console.log(`User ID for ${username} is: ${user.id}`);
      return user.id;
    } else {
      console.log('User not found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user ID:', error);
    return null;
  }
};

fetchUserIdByUsername('');
