const router = require('express').Router();
const { createCard, getCards, delCardById } = require('../controllers/cards');
const { addCardLike, delCardLike } = require('../controllers/cards');
const { celebrate, Joi } = require('celebrate');

router.post('/cards', createCard);
router.get('/cards', getCards);
router.delete('/cards/:id', delCardById);
router.put('/cards/:cardId/likes', addCardLike);
router.delete('/cards/:cardId/likes', delCardLike);


module.exports = router;
