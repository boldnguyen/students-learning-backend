import * as mongoose from 'mongoose';

export const CourseSchema = new mongoose.Schema({
  name: String,
  score: Number,
  enrollment: Number,
  semester: String,
  major: String,
  majorBackup: String,
});
