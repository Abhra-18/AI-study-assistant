const PdfDocument = require('../models/PdfDocument');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdfParse = require('pdf-parse');
const Quiz = require('../models/Quiz');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

// Helper to calculate Cosine Similarity between two vectors
const cosineSimilarity = (vecA, vecB) => {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

// Helper to chunk text
const chunkText = (text, maxTokens = 1000) => {
  // A naive chunker by words/paragraphs. 1 token ~ 4 chars. So 1000 tokens ~ 4000 chars.
  const chunkSize = 3000;
  const overlap = 500;
  const chunks = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + chunkSize));
    i += chunkSize - overlap;
  }
  return chunks;
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

// Helper to strip markdown JSON wrapping if Gemini returns it
const parseGeminiJson = (text) => {
  try {
    const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error('Failed to parse AI response as JSON');
  }
};

// @desc    Upload PDF, extract text, chunk, embed, and summarize
// @route   POST /api/pdf/upload
// @access  Private
const uploadPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const pdfData = await pdfParse(req.file.buffer);
    const rawText = pdfData.text;

    if (!rawText || rawText.trim().length === 0) {
      return res.status(400).json({ message: 'Could not extract text from PDF. It might be scanned or empty.' });
    }

    // Generate Summary
    const summaryPrompt = `Summarize the following document in 3-4 sentences:\n\n${rawText.slice(0, 15000)}`; // limit context for summary
    const summaryResponse = await generateWithRetry(summaryPrompt);
    const summary = summaryResponse.text();

    // Chunk text
    const chunks = chunkText(rawText);

    // Generate Embeddings for chunks
    console.log(`Generating embeddings for ${chunks.length} chunks...`);
    const chunkDocs = [];
    for (const text of chunks) {
      if (!text.trim()) continue;
      const embResult = await embeddingModel.embedContent(text);
      chunkDocs.push({
        text,
        embedding: embResult.embedding.values
      });
    }

    // Title from original filename or text
    let title = req.file.originalname.replace('.pdf', '');

    const pdfDocument = await PdfDocument.create({
      user: req.user.id,
      filename: req.file.originalname,
      title,
      summary,
      chunks: chunkDocs
    });

    res.status(201).json({
      _id: pdfDocument._id,
      title: pdfDocument.title,
      filename: pdfDocument.filename,
      summary: pdfDocument.summary,
      chunksCount: pdfDocument.chunks.length
    });
  } catch (error) {
    console.error('PDF Upload Error:', error);
    res.status(500).json({ message: 'Failed to process PDF', error: error.message });
  }
};

// @desc    Get user's PDFs
// @route   GET /api/pdf
// @access  Private
const getPdfs = async (req, res) => {
  try {
    const pdfs = await PdfDocument.find({ user: req.user.id })
      .select('-chunks') // exclude heavy chunks
      .sort({ createdAt: -1 });
    res.json(pdfs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch PDFs' });
  }
};

// @desc    Chat with PDF via Vector Search
// @route   POST /api/pdf/:id/chat
// @access  Private
const chatPdf = async (req, res) => {
  try {
    const { prompt } = req.body;
    const pdf = await PdfDocument.findOne({ _id: req.params.id, user: req.user.id });

    if (!pdf) return res.status(404).json({ message: 'Document not found' });

    // 1. Embed user query
    const queryEmbResult = await embeddingModel.embedContent(prompt);
    const queryVector = queryEmbResult.embedding.values;

    // 2. Vector Search (Cosine Similarity)
    const similarities = pdf.chunks.map(chunk => ({
      text: chunk.text,
      score: cosineSimilarity(queryVector, chunk.embedding)
    }));

    // 3. Sort by descending score and take top 3 most relevant chunks
    similarities.sort((a, b) => b.score - a.score);
    const topContexts = similarities.slice(0, 3).map(c => c.text).join('\n\n---\n\n');

    // 4. Generate Answer using RAG
    const ragPrompt = `
    You are an AI assistant helping a student understand their document.
    Answer the user's question based ONLY on the following context retrieved from their PDF. 
    If the context does not contain the answer, say "I couldn't find the answer in the document."

    Context:
    ${topContexts}

    User Question: ${prompt}
    `;

    const response = await generateWithRetry(ragPrompt);
    res.json({ reply: response.text() });
  } catch (error) {
    console.error('PDF Chat Error:', error);
    res.status(500).json({ message: 'Failed to chat with PDF', error: error.message });
  }
};

// @desc    Generate Quiz from PDF via Vector Search
// @route   POST /api/pdf/:id/quiz
// @access  Private
const generatePdfQuiz = async (req, res) => {
  try {
    const { topic } = req.body;
    const pdf = await PdfDocument.findOne({ _id: req.params.id, user: req.user.id });

    if (!pdf) return res.status(404).json({ message: 'Document not found' });

    let topContexts = "";

    if (topic && topic.trim() !== "") {
      // Find chunks specifically related to the topic
      const queryEmbResult = await embeddingModel.embedContent(topic);
      const queryVector = queryEmbResult.embedding.values;
      const similarities = pdf.chunks.map(chunk => ({
        text: chunk.text,
        score: cosineSimilarity(queryVector, chunk.embedding)
      }));
      similarities.sort((a, b) => b.score - a.score);
      topContexts = similarities.slice(0, 5).map(c => c.text).join('\n\n---\n\n');
    } else {
      // No specific topic, just grab random distributed chunks
      const randomChunks = [];
      const step = Math.max(1, Math.floor(pdf.chunks.length / 5));
      for (let i = 0; i < pdf.chunks.length; i += step) {
        randomChunks.push(pdf.chunks[i].text);
      }
      topContexts = randomChunks.slice(0, 5).join('\n\n---\n\n');
    }

    const ragPrompt = `
    Based on the following excerpts from a document, generate a multiple-choice quiz with 5 questions.
    Return ONLY a valid JSON array of objects with this exact structure, no markdown wrapping, no extra text:
    [
      {
        "question": "The question text",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correct": 0
      }
    ]

    Excerpts:
    ${topContexts}
    `;

    const response = await generateWithRetry(ragPrompt);
    const questions = parseGeminiJson(response.text());

    // Save quiz to DB
    const quiz = await Quiz.create({
      title: `${pdf.title} Quiz${topic ? ` - ${topic}` : ''}`,
      subject: 'Document Specific',
      questionsCount: questions.length,
      difficulty: 'Intermediate',
      questions: questions,
      user: req.user.id
    });

    res.status(201).json(quiz);
  } catch (error) {
    console.error('PDF Quiz Error:', error);
    res.status(500).json({ message: 'Failed to generate quiz from PDF', error: error.message });
  }
};

module.exports = {
  uploadPdf,
  getPdfs,
  chatPdf,
  generatePdfQuiz
};
