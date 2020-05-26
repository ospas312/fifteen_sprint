const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const { KEY } = require('../config');

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar,
    email, password,
  } = req.body;
  User.findOne({ email })
    .then((users) => {
      if (users) {
        throw new NotFoundError('Email уже используется');
      }
      bcrypt.hash(password, 10)
        .then((hash) => User.create({
          name, email, password: hash, about, avatar,
        }))
        .then((user) => User.findOne({ _id: user._id }))
        .then((user) => res.send({ data: user }))
        .catch(next);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, KEY, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ token });
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new NotFoundError('Not found user id');
    })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Not found user id');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch(next);
};
