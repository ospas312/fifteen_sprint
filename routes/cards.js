const router = require('express').Router();
const { createCard, getCards, delCardById } = require('../controllers/cards');
const { addCardLike, delCardLike } = require('../controllers/cards');
const { celebrate, Joi } = require('celebrate');

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
  }),
}), createCard);
router.get('/cards', getCards);
router.delete('/cards/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), delCardById);
router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), addCardLike);
router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), delCardLike);


module.exports = router;
