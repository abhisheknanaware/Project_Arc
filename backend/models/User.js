const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    // Not required — OAuth users won't have a password
  },
  name: { type: String },
  avatar: { type: String },
  provider: {
    type: String,
    enum: ['local', 'google', 'github'],
    default: 'local'
  },
  providerId: { type: String }   // OAuth provider's user ID
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
