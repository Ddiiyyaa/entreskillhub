const express = require('express');
const router = express.Router();
const {
  getRoadmapByIdeaId,
  createRoadmap,
  getAllRoadmaps
} = require('../controllers/roadmapController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getAllRoadmaps);
router.get('/:ideaId', getRoadmapByIdeaId);
router.post('/', protect, adminOnly, createRoadmap);

module.exports = router;