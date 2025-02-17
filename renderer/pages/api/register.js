import nextConnect from 'next-connect';
import { sequelize } from '../../utils/database';
import defineUserModel from '../../models/User';

const User = defineUserModel(sequelize);

const handler = nextConnect();

handler.post(async (req, res) => {
  const { id, username, password, role } = req.body;

  if (!id || !username || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newUser = await User.create({
      id,
      username,
      password,
      role: role || 'user',
    });

    res.status(201).json({ user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
});

export default handler;
