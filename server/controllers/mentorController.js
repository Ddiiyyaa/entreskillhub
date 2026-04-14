const Mentor = require('../models/Mentor');

exports.getAllMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find({ isVerified: true })
      .populate('user', 'name email');
    res.status(200).json(mentors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMentorById = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id)
      .populate('user', 'name email');
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }
    res.status(200).json(mentor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.registerAsMentor = async (req, res) => {
  try {
    const existing = await Mentor.findOne({ user: req.user.id });
    if (existing) {
      return res.status(400).json({ message: 'Already registered as mentor' });
    }

    const mentor = new Mentor({
      user: req.user.id,
      ...req.body
    });

    await mentor.save();
    res.status(201).json({
      message: 'Mentor registered successfully, pending verification',
      mentor
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.verifyMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }
    res.status(200).json({
      message: 'Mentor verified successfully',
      mentor
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateMentorProfile = async (req, res) => {
  try {
    const mentor = await Mentor.findOneAndUpdate(
      { user: req.user.id },
      { ...req.body },
      { new: true }
    );
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }
    res.status(200).json({
      message: 'Profile updated successfully',
      mentor
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMentorsByExpertise = async (req, res) => {
  try {
    const { expertise } = req.body;
    const mentors = await Mentor.find({
      isVerified: true,
      expertise: { $in: expertise }
    }).populate('user', 'name email');
    res.status(200).json(mentors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};