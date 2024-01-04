const Seat = require('../models/seats.model');

exports.getAll = async (req, res) => {
    try {
        res.json(await Seat.find());
      }
      catch(err) {
        res.status(500).json({ message: err });
      }
};

exports.getById = async (req, res) => {
    try {
        const seat = await Seat.findById(req.params.id);
        if(!seat) res.status(404).json({ message: 'Seat not found' });
        else res.json(seat);
      }
      catch(err) {
        res.status(500).json({ message: err });
      }
};

exports.postOne = async (req, res) => {
    try {
        const { day, seat, client, email } = req.body;
        const newSeat = new Seat({ day: day, seat: seat, client: client, email: email });

        if(await Seat.exists({day: day, seat: seat})) {
          return res.status(400).json({message: err});
        }

        await newSeat.save();
        //emitt new updated taken seats to all sockets
        req.io.emit('seatsUpdated', await Seat.find());
        res.json({ message: 'OK' });
        
      
      } catch(err) {
        res.status(500).json({ message: err });
      }
      
};

exports.putById = async (req, res) => {
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
};

exports.deleteById = async (req, res) => {
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
};