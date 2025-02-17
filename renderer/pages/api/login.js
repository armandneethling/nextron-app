import { sequelize } from '../../../utils/database';
import defineUserModel from '../../../models/User';
import bcrypt from 'bcryptjs';
import withSession from '../../../utils/withSession';

const User = defineUserModel(sequelize);

const loginHandler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const { username, password } = req.body;

      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      req.session.user = { id: user.id, username: user.username, role: user.role };
      await req.session.save();

      res.status(200).json({ message: 'Login successful', user: { id: user.id, username: user.username, role: user.role } });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default withSession(loginHandler);
