export interface Course extends Document {
  _id: string;
  year: string;
  course: string;
  credit: string;
  major: string;
  majorBackup: string;
  englishLevel: string;
  version: string;
}
