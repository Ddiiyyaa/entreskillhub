const mongoose = require("mongoose");

const IdeaSchema = new mongoose.Schema({
  title:         { type: String, required: true, trim: true },
  description:   { type: String, required: true, trim: true },
  category:      { type: String, enum: ["Technology","Healthcare","Education","Finance","Sustainability","E-Commerce","Social Impact","Other"], default: "Other" },
  difficulty:    { type: String, enum: ["Beginner","Intermediate","Advanced"], default: "Beginner" },
  tags:          { type: [String], default: [] },
  estimatedTime: { type: String, default: "" },
  resources:     { type: [String], default: [] },
  createdBy:     { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Idea", IdeaSchema);