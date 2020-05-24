const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(next);
};
module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(next);
};
module.exports.delCardById = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Not found card id');
      }
      const { owner } = card;
      return owner;
    })
    .then((owner) => {
      if (owner.toString() !== req.user._id) {
        throw new ForbiddenError('Not enough rights delete this card');
      }
      return Card.findByIdAndRemove(req.params.id)
        .then((card) => {
          res.send({ data: card });
        })
        .catch(() => {
          throw new NotFoundError('an error occurred');
        });
    })
    .catch(next);
};

module.exports.addCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      throw new NotFoundError('Card not id');
    })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.delCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      throw new NotFoundError('Card not id');
    })
    .then((card) => res.send({ data: card }))
    .catch(next);
};
