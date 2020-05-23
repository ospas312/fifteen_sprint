const router = require('express').Router();
const { getUsers, getUserById } = require('../controllers/users');
const { updateUser, updateUserAvatar } = require('../controllers/users');
const { celebrate, Joi } = require('celebrate');


router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.patch('/users/me', updateUser);
router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
