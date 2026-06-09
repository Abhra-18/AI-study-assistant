const Quiz = require('../models/Quiz');

// @desc    Get all quizzes for user
// @route   GET /api/quizzes
// @access  Private
const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new quiz
// @route   POST /api/quizzes
// @access  Private
const createQuiz = async (req, res) => {
  try {
    const { title, subject, difficulty, questions } = req.body;

    if (!title || !subject || !questions || questions.length === 0) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const quiz = await Quiz.create({
      title,
      subject,
      questionsCount: questions.length,
      difficulty,
      questions,
      user: req.user.id
    });

    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a quiz (e.g., set score, mark completed)
// @route   PUT /api/quizzes/:id
// @access  Private
const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Make sure the logged in user matches the quiz user
    if (quiz.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this quiz' });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a quiz
// @route   DELETE /api/quizzes/:id
// @access  Private
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Make sure the logged in user matches the quiz user
    if (quiz.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this quiz' });
    }

    await quiz.deleteOne();
    res.json({ id: req.params.id, message: 'Quiz deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz
};
