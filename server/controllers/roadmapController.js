const Roadmap = require('../models/Roadmap');

exports.getRoadmapByIdeaId = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ businessIdea: req.params.ideaId })
      .populate('businessIdea');
    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }
    res.status(200).json(roadmap);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createRoadmap = async (req, res) => {
  try {
    const roadmap = new Roadmap(req.body);
    await roadmap.save();
    res.status(201).json({
      message: 'Roadmap created successfully',
      roadmap
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find().populate('businessIdea');
    res.status(200).json(roadmaps);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};