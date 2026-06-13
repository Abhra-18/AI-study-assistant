# 🤖 AI Study Assistant

An AI-powered study platform that helps students learn smarter with intelligent notes, adaptive quizzes, PDF analysis, and a personal AI tutor.

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| 🖥️ **Frontend** | [ai-study-assistant-kappa-two.vercel.app](https://ai-study-assistant-kappa-two.vercel.app) |
| ⚙️ **Backend API** | [ai-study-assistant-7yrm.onrender.com](https://ai-study-assistant-7yrm.onrender.com) |

## ✨ Features

- 📝 **AI-Powered Notes** — Create and enhance notes with Gemini AI
- 🧠 **Adaptive Quizzes** — Auto-generated quizzes from your study material
- 📄 **PDF Analysis** — Upload PDFs and chat with your documents
- 🤖 **AI Tutor** — Personal AI assistant for study help
- 🔐 **Authentication** — Secure JWT-based login & registration
- 📱 **Responsive UI** — Works on all devices

## 🛠️ Tech Stack

### Frontend
- **React** + **Vite**
- **Tailwind CSS**
- **React Router**

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** Authentication
- **Google Gemini AI** API
- **Multer** (PDF uploads)

### Deployment
- **Frontend** → Vercel
- **Backend** → Render
- **Database** → MongoDB Atlas

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Google Gemini API key

### Clone the Repository
```bash
git clone https://github.com/Abhra-18/AI-study-assistant.git
cd AI-study-assistant
```

### Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

### Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
```

### Run Locally
```bash
# From project root — starts both frontend and backend
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## 📁 Project Structure

```
AI-study-assistant/
├── src/                  # React frontend source
│   ├── components/       # Reusable UI components
│   ├── pages/            # Page components
│   ├── context/          # React context (Auth, etc.)
│   └── main.jsx
├── backend/              # Express backend
│   ├── controllers/      # Route controllers
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   └── server.js
├── vercel.json           # Vercel deployment config
└── package.json
```

## 📝 License

MIT License © 2026 [Abhra-18](https://github.com/Abhra-18)
