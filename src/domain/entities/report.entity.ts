import * as mongoose from 'mongoose';

export const ReportSchema = new mongoose.Schema({
  year: String,
  semester: String,
  course: String,
  credit: String,
  major: String,
  englishLevel: String,
  version: String,
});
