import { Document } from 'mongoose';

export interface Schedule extends Document {
  readonly _id: string;
  readonly course: string;
  readonly studentCode: string;
  readonly score: number;
  readonly enrollment: number;
}
