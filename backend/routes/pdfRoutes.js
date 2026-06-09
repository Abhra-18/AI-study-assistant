const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/auth');
const { uploadPdf, getPdfs, chatPdf, generatePdfQuiz } = require('../controllers/pdfController');

// Multer config for in-memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

router.route('/')
  .get(protect, getPdfs);

router.post('/upload', protect, upload.single('file'), uploadPdf);
router.post('/:id/chat', protect, chatPdf);
router.post('/:id/quiz', protect, generatePdfQuiz);

module.exports = router;
