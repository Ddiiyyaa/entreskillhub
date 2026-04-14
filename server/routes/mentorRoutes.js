const express = require('express');
const router = express.Router();
const {
  getAllMentors,
  getMentorById,
  registerAsMentor,
  verifyMentor,
  updateMentorProfile,
  getMentorsByExpertise
} = require('../controllers/mentorController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getAllMentors);
router.get('/:id', getMentorById);
router.post('/register', protect, registerAsMentor);
router.put('/verify/:id', protect, adminOnly, verifyMentor);
router.put('/profile', protect, updateMentorProfile);
router.post('/search', getMentorsByExpertise);

module.exports = router;