'use strict';

const bodyParser = require('body-parser');
const Router = require('express').Router;
const hitRouter = module.exports = Router();
const Hit = require('../model/Hit');
const AppError = require('../lib/AppError');

hitRouter.get('/all', (req, res) => {
  Hit.find({}, (err, hits) => {
    if (err)
      return res.sendError(err); // 500, not AppError

    res.json(hits);
  });
});


hitRouter.get('/:id', (req, res) => {
  let _id = req.params.id;
  if(!_id)
    return res.sendError(AppError.error404('get requested with no ID'));

  Hit.findById(_id, (err, hit) => {
    if (err)
      return res.sendError(err);

    if (!hit)
      return res.sendError(AppError.error404('get requested with invalid ID'));

    res.json(hit);
  });
});


hitRouter.post('/', bodyParser.json(), (req, res) => {
  if(!req.body || !req.body.name || !req.body.location || !req.body.location || !req.body.price)
    return res.sendError(AppError.error400('post requested with invalid body'));

  let newHit = new Hit(req.body);
  newHit.save((err, hit) => {
    if (err)
      return res.sendError(err); // 500 not AppError

    res.json(hit);
  });
});


hitRouter.put('/:id', bodyParser.json(), (req, res) => {
  let _id = req.params.id;
  if(!_id)
    return res.sendError(AppError.error404('put requested with no ID'));

  if (Object.keys(req.body).length) {
    Hit.findByIdAndUpdate(_id, req.body, (err, hit) => {
      if (err)
        return res.sendError(err);

      if (!hit)
        return res.sendError(AppError.error404('put requested with invalid ID'));

      res.json(Hit.findOne({_id}));
    });
  }
  return res.sendError(AppError.error400('no body specified or invalid body'));
});


hitRouter.delete('/:id', (req, res) => {
  let _id = req.params.id;
  if(!_id)
    return res.sendError(AppError.error404('delete requested with no ID'));

  Hit.findByIdAndRemove(_id, (err, hit) => {
    if (err)
      return res.sendError(err);

    if (!hit)
      return res.sendError(AppError.error404('delete requested with invalid ID'));

    res.status(204).end();
  });
});