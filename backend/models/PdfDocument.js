const mongoose = require('mongoose');

const chunkSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  embedding: {
    type: [Number], // Array of numbers representing the vector
    required: true
  }
}, { _id: false });

const pdfDocumentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: '📄'
  },
  chunks: [chunkSchema]
}, { timestamps: true });

module.exports = mongoose.model('PdfDocument', pdfDocumentSchema);
