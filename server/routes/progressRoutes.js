const express = require('express');
const router = express.Router();

const {
  getUserProgress,
  startProgress,
  updateProgress,
  toggleBookmark,
  getBookmarks
} = require('../controllers/progressController');

const { protect } = require('../middleware/authMiddleware');

// Get all progress of logged-in user
router.get('/', protect, getUserProgress);

// Start a business idea
router.post('/start', protect, startProgress);

// Update progress
router.put('/:id', protect, updateProgress);

// Bookmark / Unbookmark idea
router.post('/bookmark/:ideaId', protect, toggleBookmark);

// Get all bookmarked ideas
router.get('/bookmarks/all', protect, getBookmarks);

module.exports = router;