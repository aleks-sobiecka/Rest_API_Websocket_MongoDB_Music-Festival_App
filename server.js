const helmet = require('helmet');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const socket = require('socket.io');

const app = express();

// import routes
const testimonialRoutes = require('./routes/testimonials.routes');
const concertRoutes = require('./routes/concerts.routes');
const seatRoutes = require('./routes/seats.routes');

//middleware
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
/* app.use(cors({
    "origin": "https://kodilla.com", //origin sets domains that we approve
    "methods": "GET,POST", //we allow only GET and POST methods
})); */

//middleware for io - to be available in routers
app.use((req, res, next) => {
    req.io = io;
    next();
  });

app.use('/api', testimonialRoutes); // add testimonials routes to server
app.use('/api', concertRoutes); // add concert routes to server
app.use('/api', seatRoutes); // add seat routes to server

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/client/build')));

// show app on /
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

// catching bad links
app.use((req, res) => {
    res.status(404).json({ message: 'Not found...' });
});

// connects server with the database
const NODE_ENV = process.env.NODE_ENV;
let dbURI = '';


if(NODE_ENV === 'production') dbURI = 'mongodb+srv://alekssobiecka:'+ process.env.DB_PASS +'@cluster0.mwo8so1.mongodb.net/NewWaveDB?retryWrites=true&w=majority'
else if(NODE_ENV === 'test') dbURI = 'mongodb://0.0.0.0:27017/NewWaveDBtest';
else dbURI = 'mongodb://0.0.0.0:27017/NewWaveDB';


mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
//.connect('mongodb+srv://alekssobiecka:NewWaveDB@cluster0.mwo8so1.mongodb.net/NewWaveDB?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to the database');
});
db.on('error', err => console.log('Error ' + err));

//start server
const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running on port: 8000');
  });

//integrate socket with server
const io = socket(server);

//listener on event connection
io.on('connection', (socket) => {
    console.log('New socket!', socket.id);
});

module.exports = server;
  