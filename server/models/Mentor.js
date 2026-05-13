const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema(
  {
    // Optional link to a User account (not required for standalone mentor entries)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Self-contained fields — always present regardless of User ref
    name: {
      type: String,
      required: [true, "Mentor name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Mentor email is required"],
      trim: true,
      lowercase: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    expertise: {
      type: [String],
      default: [],
    },
    industry: {
      type: String,
      default: "",
    },
    experience: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    linkedIn: {
      type: String,
      default: "",
    },
    availability: {
      type: String,
      enum: ["available", "busy", "unavailable"],
      default: "available",
    },
    sessionPrice: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: true, // ← KEY FIX: defaults to true so new docs show immediately
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mentor", mentorSchema);