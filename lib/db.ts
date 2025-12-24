import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Lütfen .env.local dosyasına MONGODB_URI ekleyin!");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectToDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!, {
      dbName: "movieseriesdiary",
      bufferCommands: false,
    }).then((mongoose) => {
      console.log("✅ Yeni veritabanı bağlantısı kuruldu!");
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
};