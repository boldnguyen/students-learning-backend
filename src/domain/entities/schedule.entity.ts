import * as mongoose from 'mongoose';

export const ScheduleSchema = new mongoose.Schema({
  course: String,
  studentCode: String,
  score: Number,
  enrollment: Number,
});
