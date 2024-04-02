import { Document } from 'mongoose';

export interface Major extends Document {
  readonly _id: string;
  readonly name: string;
}
