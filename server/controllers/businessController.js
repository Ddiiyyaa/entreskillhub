const BusinessIdea = require('../models/BusinessIdea');

exports.getAllIdeas = async (req, res) => {
  try {
    const ideas = await BusinessIdea.find();
    res.status(200).json(ideas);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getIdeaById = async (req, res) => {
  try {
    const idea = await BusinessIdea.findById(req.params.id);
    if (!idea) {
      return res.status(404).json({ message: 'Business idea not found' });
    }
    res.status(200).json(idea);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getIdeasBySkills = async (req, res) => {
  try {
    const { skills } = req.body;
    const ideas = await BusinessIdea.find({
      requiredSkills: { $in: skills }
    });
    res.status(200).json(ideas);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createIdea = async (req, res) => {
  try {
    const idea = new BusinessIdea(req.body);
    await idea.save();
    res.status(201).json({
      message: 'Business idea created successfully',
      idea
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteIdea = async (req, res) => {
  try {
    await BusinessIdea.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Business idea deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};