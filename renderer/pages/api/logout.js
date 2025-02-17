export default async (req, res) => {
    try {
      if (req.method === 'POST') {
        req.session.destroy(err => {
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