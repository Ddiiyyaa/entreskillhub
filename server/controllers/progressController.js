const Progress = require('../models/Progress');

exports.getUserProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ user: req.user.id })
      .populate('businessIdea')
      .populate('roadmap');
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.startProgress = async (req, res) => {
  try {
    const { businessIdeaId, roadmapId } = req.body;

    const existing = await Progress.findOne({
      user: req.user.id,
      businessIdea: businessIdeaId
    });

    if (existing) {
      return res.status(400).json({ message: 'Already started this business idea' });
    }

    const progress = new Progress({
      user: req.user.id,
      businessIdea: businessIdeaId,
      roadmap: roadmapId,
      status: 'in_progress'
    });

    await progress.save();
    res.status(201).json({
      message: 'Progress started successfully',
      progress
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { completedSteps, status, notes } = req.body;

    const progress = await Progress.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        completedSteps,
        status,
        notes,
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    res.status(200).json({
      message: 'Progress updated successfully',
      progress
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.toggleBookmark = async (req, res) => {
  try {
    const progress = await Progress.findOne({
      user: req.user.id,
      businessIdea: req.params.ideaId
    });

    if (!progress) {
      const newProgress = new Progress({
        user: req.user.id,
        businessIdea: req.params.ideaId,
        bookmarked: true
      });
      await newProgress.save();
      return res.status(201).json({ message: 'Bookmarked successfully' });
    }

    progress.bookmarked = !progress.bookmarked;
    await progress.save();

    res.status(200).json({
      message: progress.bookmarked ? 'Bookmarked' : 'Bookmark removed',
      bookmarked: progress.bookmarked
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Progress.find({
      user: req.user.id,
      bookmarked: true
    }).populate('businessIdea');
    res.status(200).json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};