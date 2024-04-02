import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  userName: String,
  password: String,
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
});
