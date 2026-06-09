const express = require('express');
const router = express.Router();
const { getQuizzes, createQuiz, updateQuiz, deleteQuiz } = require('../controllers/quizController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getQuizzes)
  .post(protect, createQuiz);

router.route('/:id')
  .put(protect, updateQuiz)
  .delete(protect, deleteQuiz);

module.exports = router;
