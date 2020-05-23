const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar,
    email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash, about, avatar,
    }))
    .then((user) => User.findOne({ _id: user._id }))
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(404).send({ message: 'Not create user' }));
};

module.exports.login = (req, res) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
        .end();
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(404).send({ message: 'Not found users' }));
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new NotFoundError('Not found user id');
    })
    /**.then((user) => res.send({ data: user }))
    .catch(() => res.status(404).send({ message: 'Not found user id' }));*/
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Not found user id');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(404).send({ message: 'Not found user' }));
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(404).send({ message: 'Not found user or not correct url' }));
};
