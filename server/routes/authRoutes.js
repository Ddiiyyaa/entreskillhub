const express = require("express");
const router = express.Router();
const Idea = require("../models/Idea");
const adminAuth = require("../middleware/adminAuth");

router.use(adminAuth);

// Get all ideas
router.get("/ideas", async (req, res) => {
  try {
    const ideas = await Idea.find().sort({ createdAt: -1 });
    res.json(ideas);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch ideas." });
  }
});

// Add idea
router.post("/ideas", async (req, res) => {
  try {
    const { title, description, category, difficulty, tags, estimatedTime, resources } = req.body;
    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({ message: "Title and description are required." });
    }
    const idea = await Idea.create({ title, description, category, difficulty, tags, estimatedTime, resources, createdBy: req.user._id });
    res.status(201).json(idea);
  } catch (err) {
    res.status(500).json({ message: "Failed to create idea." });
  }
});

// Delete idea
router.delete("/ideas/:id", async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: "Idea not found." });
    await idea.deleteOne();
    res.json({ message: "Deleted.", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete." });
  }
});

module.exports = router;