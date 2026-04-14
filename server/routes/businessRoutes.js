const express = require('express');
const router = express.Router();
const {
  getAllIdeas,
  getIdeaById,
  getIdeasBySkills,
  createIdea,
  deleteIdea
} = require('../controllers/businessController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getAllIdeas);
router.get('/:id', getIdeaById);
router.post('/match', protect, getIdeasBySkills);
router.post('/', protect, adminOnly, createIdea);
router.delete('/:id', protect, adminOnly, deleteIdea);

module.exports = router;