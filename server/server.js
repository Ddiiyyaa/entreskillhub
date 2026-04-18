const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/ideas', require('./routes/businessRoutes'));
app.use('/api/roadmaps', require('./routes/roadmapRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/mentors', require('./routes/mentorRoutes')); // ✅ NEW

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'EntreSkill Hub API is running!' });
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});