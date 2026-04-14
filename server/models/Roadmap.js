const mongoose = require('mongoose');

const roadmapStepSchema = new mongoose.Schema({
  stepNumber: Number,
  title: String,
  description: String,
  duration: String,
  resources: [String]
});

const roadmapSchema = new mongoose.Schema({
  businessIdea: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusinessIdea',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  overview: {
    type: String
  },
  steps: [roadmapStepSchema],
  totalDuration: {
    type: String
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Roadmap', roadmapSchema);