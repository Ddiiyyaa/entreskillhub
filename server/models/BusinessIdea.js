const mongoose = require('mongoose');

const businessIdeaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  requiredSkills: [String],
  estimatedCost: {
    type: String
  },
  profitPotential: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  timeToStart: {
    type: String
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('BusinessIdea', businessIdeaSchema);