import * as mongoose from 'mongoose';

export const ClassInfoSchema = new mongoose.Schema({
  classId: mongoose.Schema.ObjectId,
  englishLevel: String,
  batch: String,
  majorId: mongoose.Schema.ObjectId,
});
