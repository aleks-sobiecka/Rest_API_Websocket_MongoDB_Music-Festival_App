const express = require('express');
const router = express.Router();
const Concert = require('../models/concerts.model');

// get all concerts
router.get('/concerts', async (req, res) => {
    try {
      res.json(await Concert.find());
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  });

// get single concert by id
router.get('/concerts/:id', async (req, res) => {
    try {
      const concert = await Concert.findById(req.params.id);
      if(!concert) res.status(404).json({ message: 'Concert not found' });
      else res.json(concert);
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  });  


// post add new element to concerts
router.post('/concerts', async (req, res) => {
    try {
      const { performer, genre, price, day, image } = req.body;
      const newConcert = new Concert({ performer: performer, genre: genre, price: price, day: day, image: image });
      await newConcert.save();
      res.json({ message: 'OK' });
    } catch(err) {
      res.status(500).json({ message: err });
    }
  });
  

// put modify concert by id
router.put('/concerts/:id', async (req, res) => {
    const { performer, genre, price, day, image } = req.body;
    try {
      const concert = await Concert.findById(req.params.id);
      if(concert) {
        concert.performer = performer;
        concert.genre = genre;
        concert.price = price;
        concert.day = day;
        concert.image = image;
        await concert.save();
        res.json({ message: 'OK'})
    }
      else res.status(404).json({ message: 'Concert not found...' });
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  });

router.delete('/concerts/:id', async (req, res) => {
    try {
      const concert = await Concert.findById(req.params.id);
      if(concert) {
        await Concert.deleteOne({ _id: req.params.id });
        res.json({ message: 'OK' });
      }
      else res.status(404).json({ message: 'Concert not found...' });
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  });
  

module.exports = router;