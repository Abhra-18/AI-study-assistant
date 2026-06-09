const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  summarizeNote,
  generateQuiz,
  chat,
  explainConcept,
  generateRevision
} = require('../controllers/aiController');

router.post('/summarize', protect, summarizeNote);
router.post('/generate-quiz', protect, generateQuiz);
router.post('/chat', protect, chat);
router.post('/explain', protect, explainConcept);
router.post('/revision', protect, generateRevision);

module.exports = router;
