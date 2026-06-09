const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    default: 'General'
  },
  content: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: '#6366f1'
  },
  tags: [{
    type: String
  }],
  isFavorite: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
