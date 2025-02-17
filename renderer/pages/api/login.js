import { sequelize } from '../../../utils/database';
import defineUserModel from '../../../models/User';
import bcrypt from 'bcryptjs';

const User = defineUserModel(sequelize);

export default async (req, res) => {
  try {
    if (req.method === 'POST') {
      const { username, password } = req.body;
      console.log('Received username:', username);
      console.log('Received password:', password);

      const user = await User.findOne({ where: { username } });
      console.log('User found:', user);

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('Is password valid:', isPasswordValid);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      res.status(200).json({ message: 'Login successful', user });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
