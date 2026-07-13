const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet'); // Naya Security Package
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./utils/errorHandler'); // Custom errors

// Environment config load garne
dotenv.config();

// Database connect garne
connectDB();

const app = express();

// Middlewares
app.use(helmet()); // Set security HTTP headers

// CORS update (Production ma tapai ko domain matra rakhnu)
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://hamrokanoon.com' : 'http://localhost:3000',
  credentials: true
})); 

app.use(express.json()); // JSON data read garna

// Test Route
app.get('/', (req, res) => {
  res.send('Hamro Kanoon API is running securely...');
});

// Import Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes')); 
app.use('/api/laws', require('./routes/lawRoutes'));

// Error Handling Middlewares (Routes vanda muni rakhnai parcha)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});