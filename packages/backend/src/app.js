const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const roomsRoutes = require('./routes/roomsRoutes');
const fitRoutes = require('./routes/fitRoutes');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', application: 'DesignFit' });
});

app.use('/api/rooms', roomsRoutes);
app.use('/api/fit-check', fitRoutes);

module.exports = { app };