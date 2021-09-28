const Card = require('../models/card');
const List = require('../models/list');

// Get all cards for a list
exports.getCards = (req, res) => {

  Card
  .find({list: req.params.list})
  .exec((err, cards) => {
    if (err) throw err;
    res.status(200).json(cards)
  })
}

exports.getCard = (req, res) => {
  res.status(200).json(req.card);
}

exports.postCard = (req, res) => {
  if (!req.body.name) {
    res.status(400).send("No name included in request")
    return res.end();
  } 

  let newCard = new Card({
    name: req.body.name,
    description: req.body.description || null,
    activities: [],
    labels: [],
    comments: [],
    list: req.params.list
  })

  req.list.cards.push(newCard);
  req.list.save();

  newCard.save((err, card) => {
    if (err) next(err)
    res.status(200).json(card);
  })  
}

// Adds a card to a list's references
exports.addCardToList = (req, res) => {
  List.findOneAndUpdate({_id: req.list._id}, {'$push': {'cards': req.card._id}}, {new: true})
  .exec((err, list) => {
    if (err) throw err;

    // Update the card's list reference
    Card.updateOne({_id: req.card._id}, {list: list._id})
    .exec(err => {
      if (err) throw err;

      res.status(200).json(list);
    })
  })
}

// Removes a card from a list's references 
exports.removeCardFromList = (req, res) => {
  List.updateOne({_id: req.list._id}, {'$pull': {'cards': req.card._id}})
    .exec((err, card) => {
      if (err) next(err)

      if (card.modifiedCount) {
        // Send the id of the removed card and the id of the list
        res.status(200).send({
          card: req.card._id,
          list: req.list._id
        })
      } else {
        // Return 404 if the specified card wasn't part of the list
        res.status(404).send('Card not in list');
      }   
    })
}

exports.deleteCard = (req, res) => {
  Card.deleteOne({_id: req.card._id})
  .then(() => {

    List.updateOne({_id: req.card.list}, {'$pull': {'cards': req.card._id}})
    .exec(err => {
      if (err) next(err)
      res.status(200).send(req.card._id)
    })
  })
}

exports.updateCard = (req, res) => {
  if (!req.body.name || !req.body.description ||!req.body.list) {
    res.status(400).send("No update information included in request body")
    return res.end();
  } 
  const update = req.body;

  Card.findOneAndUpdate({_id: req.params.card}, update, { new: true })
    .exec((err, updatedCard) => {
      if (err) next(err)
      res.status(200).json(updatedCard)
    })
}