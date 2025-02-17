import nextConnect from 'next-connect';
import { sequelize } from '../../../../utils/database';
import defineUserModel from '../../../../models/User';

const User = defineUserModel(sequelize);

const handler = nextConnect();

handler.post(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const user = await User.findOne({ where: { username, password } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Error logging in user' });
  }
});

export default handler;
