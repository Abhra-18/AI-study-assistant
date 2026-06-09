const { GoogleGenerativeAI } = require('@google/generative-ai');
const Quiz = require('../models/Quiz');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Helper to strip markdown JSON wrapping if Gemini returns it
const parseGeminiJson = (text) => {
  try {
    const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error('Failed to parse AI response as JSON');
  }
};

// Helper with retry for 503 Service Unavailable
const generateWithRetry = async (prompt, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      return await result.response;
    } catch (error) {
      if (error.status === 503 && i < retries - 1) {
        console.log(`Received 503, retrying in ${1000 * (i + 1)}ms...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      } else {
        throw error;
      }
    }
  }
};

// @desc    Summarize note content
// @route   POST /api/ai/summarize
// @access  Private
const summarizeNote = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Content is required' });

    const prompt = `Please provide a concise and clear summary of the following study notes:\n\n${content}`;
    const response = await generateWithRetry(prompt);
    res.json({ summary: response.text() });
  } catch (error) {
    console.error('Summarize error:', error);
    res.status(500).json({ message: 'AI generation failed', error: error.message || error });
  }
};

// @desc    Generate a quiz from note content
// @route   POST /api/ai/generate-quiz
// @access  Private
const generateQuiz = async (req, res) => {
  try {
    const { content, title, subject } = req.body;
    if (!content) return res.status(400).json({ message: 'Content is required' });

    const prompt = `
    Based on the following notes, generate a multiple-choice quiz with 5 questions.
    Return ONLY a valid JSON array of objects with this exact structure, no markdown wrapping, no extra text:
    [
      {
        "question": "The question text",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correct": 0 // The zero-based index of the correct option
      }
    ]

    Notes:
    ${content}
    `;

    const response = await generateWithRetry(prompt);
    const questions = parseGeminiJson(response.text());

    // Save quiz to DB
    const quiz = await Quiz.create({
      title: `${title || 'Generated'} Quiz`,
      subject: subject || 'General',
      questionsCount: questions.length,
      difficulty: 'Intermediate',
      questions: questions,
      user: req.user.id
    });

    res.status(201).json(quiz);
  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ message: 'AI generation failed', error: error.message });
  }
};

// @desc    Chat with AI Assistant
// @route   POST /api/ai/chat
// @access  Private
const chat = async (req, res) => {
  try {
    const { prompt, history } = req.body;
    if (!prompt) return res.status(400).json({ message: 'Prompt is required' });

    // Formatting history for Gemini: { role: 'user' | 'model', parts: [{ text: '...' }] }
    const formattedHistory = (history || []).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const chatSession = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    let result;
    let retries = 3;
    for (let i = 0; i < retries; i++) {
      try {
        result = await chatSession.sendMessage(prompt);
        break;
      } catch (err) {
        if ((err.status === 503 || err.status === 429) && i < retries - 1) {
          console.log(`Chat ${err.status}, retrying in ${3000 * (i + 1)}ms...`);
          await new Promise(resolve => setTimeout(resolve, 3000 * (i + 1)));
        } else {
          throw err;
        }
      }
    }
    const response = await result.response;
    
    res.json({ reply: response.text() });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'AI generation failed', error: error.message || error });
  }
};

// @desc    Explain concept simply
// @route   POST /api/ai/explain
// @access  Private
const explainConcept = async (req, res) => {
  try {
    const { concept } = req.body;
    if (!concept) return res.status(400).json({ message: 'Concept is required' });

    const prompt = `Explain the following concept like I am 5 years old, using a simple and relatable analogy:\n\n${concept}`;
    const response = await generateWithRetry(prompt);
    res.json({ explanation: response.text() });
  } catch (error) {
    res.status(500).json({ message: 'AI generation failed', error: error.message });
  }
};

// @desc    Generate revision notes (bullet points)
// @route   POST /api/ai/revision
// @access  Private
const generateRevision = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Content is required' });

    const prompt = `Extract the absolute most important key takeaways from the following notes and present them as a concise bulleted list for quick revision:\n\n${content}`;
    const response = await generateWithRetry(prompt);
    res.json({ revision: response.text() });
  } catch (error) {
    res.status(500).json({ message: 'AI generation failed', error: error.message });
  }
};

module.exports = {
  summarizeNote,
  generateQuiz,
  chat,
  explainConcept,
  generateRevision
};
