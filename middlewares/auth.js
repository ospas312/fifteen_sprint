const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  if (!req.cookies.jwt) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  const token = req.cookies.jwt;
  let payload = '';
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (e) {
    const err = new Error('Необходима авторизация');
    err.statusCode = 401;
    next(err);
  }
  req.user = payload;
  return next();
};
