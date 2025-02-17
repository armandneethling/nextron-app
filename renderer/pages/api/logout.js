import withSession from '../../../utils/withSession';

const logoutHandler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      if (!req.session) {
        return res.status(400).json({ error: 'No active session to log out from' });
      }

      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to log out' });
        }
        res.status(200).json({ message: 'Logout successful' });
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error logging out user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default withSession(logoutHandler);
