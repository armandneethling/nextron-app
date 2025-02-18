const sessionMiddleware = require('./session');

const withSession = (handler) => {
  return async (req, res) => {
    await new Promise((resolve, reject) => {
      sessionMiddleware(req, res, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
    return handler(req, res);
  };
};

module.exports = withSession;
