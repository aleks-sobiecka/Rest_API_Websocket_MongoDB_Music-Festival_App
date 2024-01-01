const express = require('express');
const router = express.Router();
const Seat = require('../models/seats.model');

// get all seats
router.get('/seats', async (req, res) => {
    try {
      res.json(await Seat.find());
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
});

// get single seat by id
router.get('/seats/:id', async (req, res) => {
    try {
      const seat = await Seat.findById(req.params.id);
      if(!seat) res.status(404).json({ message: 'Seat not found' });
      else res.json(concert);
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
}); 


// post add new element to seats
router.post('/seats', async (req, res) => {
    try {
      const { day, seat, client, email } = req.body;
      const newSeat = new Seat({ day: day, seat: seat, client: client, email: email });
      await newSeat.save();
      res.json({ message: 'OK' });
    } catch(err) {
      res.status(500).json({ message: err });
    }
  });

// put modify seat by id
router.put('/seats/:id', async (req, res) => {
    const { day, seat, client, email } = req.body;
    try {
      const seatUpdated = await Seat.findById(req.params.id);
      if(seatUpdated) {
        seatUpdated.day = day;
        seatUpdated.seat = seat;
        seatUpdated.client = client;
        seatUpdated.email = email;
        await seatUpdated.save();
        res.json({ message: 'OK'});
    }
      else res.status(404).json({ message: 'Seat not found...' });
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  });

router.delete('/seats/:id', async (req, res) => {
    try {
      const seat = await Seat.findById(req.params.id);
      if(seat) {
        await Seat.deleteOne({ _id: req.params.id });
        res.json({ message: 'OK' });
      }
      else res.status(404).json({ message: 'Seat not found...' });
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  });

module.exports = router;