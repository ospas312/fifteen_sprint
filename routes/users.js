const router = require('express').Router();
const { getUsers, getUserById } = require('../controllers/users');
const { updateUser, updateUserAvatar } = require('../controllers/users');
const { celebrate, Joi } = require('celebrate');


router.get('/users', getUsers);
router.get('/users/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), getUserById);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().uri(),
  }),
}), updateUserAvatar);

module.exports = router;
