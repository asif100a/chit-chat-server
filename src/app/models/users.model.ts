import { model, Schema } from "mongoose";
import { type IUser } from "../interface/users.type";

const userSchema = new Schema<IUser>({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  age: {
    type: Number,
    required: true,
    min: [0, 'Age cannot be negative'],
  },
  city: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
  lastLogin: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

export const User = model('User', userSchema);