const jwt = require('jsonwebtoken');
const KEY = require('../config');

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  const token = req.cookies.jwt;
  let payload = '';
  try {
    payload = jwt.verify(token, KEY);
  } catch (e) {
    const err = new Error('Необходима авторизация');
    err.statusCode = 401;
    next(err);
  }
  req.user = payload;
  return next();
};
