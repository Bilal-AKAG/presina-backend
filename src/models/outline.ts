import mongoose from "mongoose";

const slideSchema = new mongoose.Schema({
  title: String,
  points: [String],
});

const outlineSchema = new mongoose.Schema({
  source: String,
  slides: [slideSchema],
  numSlides: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Outline", outlineSchema);
