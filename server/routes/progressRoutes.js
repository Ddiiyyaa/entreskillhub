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

router.get('/', protect, getUserProgress);
router.post('/start', protect, startProgress);
router.put('/:id', protect, updateProgress);
router.post('/bookmark/:ideaId', protect, toggleBookmark);
router.get('/bookmarks', protect, getBookmarks);

module.exports = router;