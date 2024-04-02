import { Document } from 'mongoose';

export interface Class extends Document {
  readonly _id: string;
  readonly name: string;
  readonly majorId: string;
  readonly major: string;
  readonly version: string;
  readonly englishLevel: string;
  readonly batch: string;
  readonly englishLevelNumber: number;
}
