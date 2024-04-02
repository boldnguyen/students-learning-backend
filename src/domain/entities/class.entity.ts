import * as mongoose from 'mongoose';

export const ClassSchema = new mongoose.Schema({
  name: String,
  majorId: mongoose.Schema.ObjectId,
  major: String,
  version: String,
  englishLevel: String,
  batch: Number,
  englishLevelNumber: Number,
});
