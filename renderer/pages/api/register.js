import { sequelize } from '../../../utils/database';
import defineUserModel from '../../../models/User';
import bcrypt from 'bcryptjs';

const User = defineUserModel(sequelize);

export default async (req, res) => {
  try {
    if (req.method === 'POST') {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        username,
        password: hashedPassword,
        role: 'user',
      });

      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};