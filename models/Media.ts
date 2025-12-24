import mongoose, { Schema, model, models } from "mongoose";

const MediaSchema = new Schema(
  {
    userId: { type: String, required: true }, // <--- YENİ: Sahip kim?
    tmdbId: { type: Number, required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ["movie", "series"], required: true },
    posterPath: { type: String },
    overview: { type: String },
    status: { 
      type: String, 
      enum: ["watching", "completed", "plan_to_watch", "dropped"], 
      default: "watching" 
    },
    season: { type: Number, default: 1 },
    episode: { type: Number, default: 1 },
    runtime: { type: String },
    rating: { type: Number, min: 0, max: 10 },
  },
  { timestamps: true }
);

const Media = models.Media || model("Media", MediaSchema);
export default Media;