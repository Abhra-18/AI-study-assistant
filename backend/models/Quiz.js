const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correct: {
    type: Number,
    required: true
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  questionsCount: {
    type: Number,
    required: true
  },
  duration: {
    type: String,
    default: '15 min'
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate'
  },
  score: {
    type: Number,
    default: null
  },
  completed: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: '🤖'
  },
  questions: [questionSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
