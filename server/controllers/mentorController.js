const Mentor = require("../models/Mentor");

// @desc    Get all verified mentors
// @route   GET /api/mentors
// @access  Public
const getAllMentors = async (req, res) => {
  try {
    const { expertise, availability, search } = req.query;

    const filter = { isVerified: true };

    if (availability) filter.availability = availability;
    if (expertise) filter.expertise = { $in: [expertise] };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { bio: { $regex: search, $options: "i" } },
        { expertise: { $in: [new RegExp(search, "i")] } },
        { industry: { $regex: search, $options: "i" } },
      ];
    }

    const mentors = await Mentor.find(filter)
      .populate({
        path: "user",
        select: "name email avatar",
        options: { strictPopulate: false }, // ← won't crash if user is null
      })
      .sort({ isFeatured: -1, rating: -1 })
      .lean(); // ← returns plain JS objects, not Mongoose documents

    // Merge: use populated user data if available, otherwise use self-contained fields
    const enriched = mentors.map((mentor) => ({
      _id: mentor._id,
      name: mentor.user?.name || mentor.name,
      email: mentor.user?.email || mentor.email,
      avatar: mentor.user?.avatar || mentor.avatar || "",
      bio: mentor.bio,
      expertise: mentor.expertise,
      industry: mentor.industry,
      experience: mentor.experience,
      rating: mentor.rating,
      totalReviews: mentor.totalReviews,
      linkedIn: mentor.linkedIn,
      availability: mentor.availability,
      sessionPrice: mentor.sessionPrice,
      isVerified: mentor.isVerified,
      isFeatured: mentor.isFeatured,
      createdAt: mentor.createdAt,
    }));

    res.status(200).json(enriched);
  } catch (error) {
    console.error("getAllMentors error:", error);
    res.status(500).json({ message: "Server error fetching mentors", error: error.message });
  }
};

// @desc    Get single mentor by ID
// @route   GET /api/mentors/:id
// @access  Public
const getMentorById = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id)
      .populate({ path: "user", select: "name email avatar", options: { strictPopulate: false } })
      .lean();

    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    const enriched = {
      _id: mentor._id,
      name: mentor.user?.name || mentor.name,
      email: mentor.user?.email || mentor.email,
      avatar: mentor.user?.avatar || mentor.avatar || "",
      bio: mentor.bio,
      expertise: mentor.expertise,
      industry: mentor.industry,
      experience: mentor.experience,
      rating: mentor.rating,
      totalReviews: mentor.totalReviews,
      linkedIn: mentor.linkedIn,
      availability: mentor.availability,
      sessionPrice: mentor.sessionPrice,
      isVerified: mentor.isVerified,
      isFeatured: mentor.isFeatured,
    };

    res.status(200).json(enriched);
  } catch (error) {
    console.error("getMentorById error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a mentor (Admin only)
// @route   POST /api/mentors
// @access  Private/Admin
const createMentor = async (req, res) => {
  try {
    const mentor = await Mentor.create(req.body);
    res.status(201).json(mentor);
  } catch (error) {
    console.error("createMentor error:", error);
    res.status(400).json({ message: "Failed to create mentor", error: error.message });
  }
};

// @desc    Update a mentor
// @route   PUT /api/mentors/:id
// @access  Private/Admin
const updateMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });
    res.status(200).json(mentor);
  } catch (error) {
    res.status(400).json({ message: "Failed to update mentor", error: error.message });
  }
};

// @desc    Delete a mentor
// @route   DELETE /api/mentors/:id
// @access  Private/Admin
const deleteMentor = async (req, res) => {
  try {
    const mentor = await Mentor.findByIdAndDelete(req.params.id);
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });
    res.status(200).json({ message: "Mentor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete mentor", error: error.message });
  }
};

module.exports = {
  getAllMentors,
  getMentorById,
  createMentor,
  updateMentor,
  deleteMentor,
};