const express = require('express');
const router = express.Router();
const Testimonial = require('../models/testionials.model');

// get all testimonials
router.get('/testimonials', async (req, res) => {
    try {
      res.json(await Testimonial.find());
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  });

// get random testimonial
router.get('/testimonials/random', async (req, res) => {
    try {
      const count = await Testimonial.countDocuments();
      const rand = Math.floor(Math.random() * count);
      const testimonial = await Testimonial.findOne().skip(rand);
      if(!testimonial) res.status(404).json({ message: 'Testimonial not found' });
      else res.json(testimonial);
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  });
  
// get single testimonial by id
router.get('/testimonials/:id', async (req, res) => {
    try {
      const testimonial = await Testimonial.findById(req.params.id);
      if(!testimonial) res.status(404).json({ message: 'Testimonial not found' });
      else res.json(testimonial);
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  }); 

// post add new element to testimonials
router.post('/testimonials', async (req, res) => {
    try {
      const { author, text } = req.body;
      const newTestimonial = new Testimonial({ author: author, text: text });
      await newTestimonial.save();
      res.json({ message: 'OK' });
    } catch(err) {
      res.status(500).json({ message: err });
    }
  });

// put modify testimonial by id
router.put('/testimonials/:id', async (req, res) => {
    const { author, text } = req.body;
    try {
      const testimonial = await Testimonial.findById(req.params.id);
      if(testimonial) {
        testimonial.author = author;
        testimonial.text = text;
        await testimonial.save();
        res.json({ message: 'OK'})
    }
      else res.status(404).json({ message: 'Testimonial not found...' });
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  });

// delete element from testimonials by id
router.delete('/testimonials/:id', async (req, res) => {
    try {
      const testimonial = await Testimonial.findById(req.params.id);
      if(testimonial) {
        await Testimonial.deleteOne({ _id: req.params.id });
        res.json({ message: 'OK' });
      }
      else res.status(404).json({ message: 'Testimonial not found...' });
    }
    catch(err) {
      res.status(500).json({ message: err });
    }
  });

module.exports = router;