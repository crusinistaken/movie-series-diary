import mongoose, { Schema, model, models } from "mongoose";

const MediaSchema = new Schema(
  {
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
    // Dizi Takibi İçin
    season: { type: Number, default: 1 },
    episode: { type: Number, default: 1 },
    // Film Takibi İçin
    runtime: { type: String }, // "01:20" gibi
    
    // --- YENİ EKLENEN PUANLAMA ALANI ---
    rating: { type: Number, min: 0, max: 10 }, 
  },
  { timestamps: true }
);

// Eğer model zaten varsa onu kullan, yoksa yenisini oluştur
const Media = models.Media || model("Media", MediaSchema);

export default Media;