import { useState, useEffect } from 'react';
import {
  BrainCircuit, Clock, BarChart3, ChevronRight,
  CheckCircle2, XCircle, ArrowLeft, Trophy, RotateCcw, Zap
} from 'lucide-react';
import './Quiz.css';

export default function Quiz() {
  const [view, setView] = useState('list'); // list | taking | results
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generate Quiz Modal
  const [showGenModal, setShowGenModal] = useState(false);
  const [genTopic, setGenTopic] = useState('');
  const [genLoading, setGenLoading] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem('studyai-token');
      const res = await fetch('/api/quizzes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setQuizzes(data);
      }
    } catch (error) {
      console.error('Failed to fetch quizzes', error);
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQ(0);
    setAnswers({});
    setShowResult(false);
    setView('taking');
  };

  const selectAnswer = (qIndex, aIndex) => {
    if (showResult) return;
    setAnswers(prev => ({ ...prev, [qIndex]: aIndex }));
  };

  const nextQuestion = () => {
    if (activeQuiz && currentQ < activeQuiz.questions.length - 1) {
      setCurrentQ(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQ > 0) {
      setCurrentQ(prev => prev - 1);
    }
  };

  const submitQuiz = async () => {
    setShowResult(true);
    setView('results');

    // Calculate score
    const newScore = Object.entries(answers).filter(
      ([qIdx, aIdx]) => activeQuiz.questions[parseInt(qIdx)]?.correct === aIdx
    ).length;
    const scorePercent = Math.round((newScore / activeQuiz.questions.length) * 100);

    // Save to backend
    try {
      const token = localStorage.getItem('studyai-token');
      await fetch(`/api/quizzes/${activeQuiz._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ score: scorePercent, completed: true })
      });
      fetchQuizzes(); // Refresh list to update score
    } catch (error) {
      console.error('Failed to save score', error);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!genTopic.trim()) return;
    setGenLoading(true);
    try {
      const token = localStorage.getItem('studyai-token');
      const res = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: `Topic: ${genTopic}`, title: genTopic, subject: 'Custom' })
      });
      const data = await res.json();
      if (res.ok) {
        setQuizzes(prev => [data, ...prev]);
        setShowGenModal(false);
        setGenTopic('');
      } else {
        alert(data.error || data.message || 'AI generation failed');
      }
    } catch (error) {
      alert('Failed to generate quiz');
    } finally {
      setGenLoading(false);
    }
  };

  const currentQuestions = activeQuiz?.questions || [];
  const score = Object.entries(answers).filter(
    ([qIdx, aIdx]) => currentQuestions[parseInt(qIdx)]?.correct === aIdx
  ).length;

  const scorePercent = Math.round((score / currentQuestions.length) * 100);

  if (view === 'taking' && activeQuiz) {
    const question = currentQuestions[currentQ];
    const progress = ((currentQ + 1) / currentQuestions.length) * 100;

    return (
      <div className="quiz-page page-container">
        <div className="content-wrapper" style={{ paddingTop: '88px', paddingBottom: '40px' }}>
          <div className="quiz-taking animate-fade-in-up">
            {/* Quiz Header */}
            <div className="quiz-taking-header">
              <button className="btn btn-ghost btn-sm" onClick={() => setView('list')}>
                <ArrowLeft size={16} />
                Back
              </button>
              <div className="quiz-progress-info">
                <span>{currentQ + 1} / {currentQuestions.length}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="progress-bar" style={{ marginBottom: '32px' }}>
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>

            {/* Question */}
            <div className="quiz-question-card glass-card">
              <div className="question-number">Question {currentQ + 1}</div>
              <h2 className="question-text">{question.question}</h2>

              <div className="options-list">
                {question.options.map((option, i) => (
                  <button
                    key={i}
                    className={`option-btn ${answers[currentQ] === i ? 'selected' : ''}`}
                    onClick={() => selectAnswer(currentQ, i)}
                  >
                    <span className="option-letter">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="option-text">{option}</span>
                    {answers[currentQ] === i && <CheckCircle2 size={18} className="option-check" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="quiz-nav">
              <button
                className="btn btn-secondary"
                onClick={prevQuestion}
                disabled={currentQ === 0}
              >
                Previous
              </button>
              {currentQ === currentQuestions.length - 1 ? (
                <button
                  className="btn btn-primary"
                  onClick={submitQuiz}
                  disabled={Object.keys(answers).length < currentQuestions.length}
                >
                  Submit Quiz
                </button>
              ) : (
                <button className="btn btn-primary" onClick={nextQuestion}>
                  Next
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'results') {
    return (
      <div className="quiz-page page-container">
        <div className="content-wrapper" style={{ paddingTop: '88px', paddingBottom: '40px' }}>
          <div className="quiz-results animate-fade-in-up">
            <div className="results-card glass-card">
              <div className="results-trophy">
                <Trophy size={48} />
              </div>
              <h1 className="results-title">Quiz Complete!</h1>
              <div className="results-score">
                <div className={`score-circle ${scorePercent >= 70 ? 'good' : 'needs-work'}`}>
                  <svg viewBox="0 0 120 120">
                    <circle className="score-bg" cx="60" cy="60" r="52" />
                    <circle
                      className="score-fill"
                      cx="60" cy="60" r="52"
                      strokeDasharray={`${(scorePercent / 100) * 327} 327`}
                    />
                  </svg>
                  <span className="score-text">{scorePercent}%</span>
                </div>
                <p className="score-detail">
                  You got <strong>{score}</strong> out of <strong>{currentQuestions.length}</strong> correct
                </p>
              </div>

              {/* Answer Review */}
              <div className="answers-review">
                {currentQuestions.map((q, i) => (
                  <div key={i} className={`review-item ${answers[i] === q.correct ? 'correct' : 'wrong'}`}>
                    <div className="review-icon">
                      {answers[i] === q.correct ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <XCircle size={18} />
                      )}
                    </div>
                    <div className="review-text">
                      <span className="review-question">{q.question}</span>
                      <span className="review-answer">
                        Your answer: {q.options[answers[i]] || 'Not answered'}
                        {answers[i] !== q.correct && (
                          <span className="correct-answer"> · Correct: {q.options[q.correct]}</span>
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="results-actions">
                <button className="btn btn-secondary" onClick={() => setView('list')}>
                  <ArrowLeft size={16} />
                  Back to Quizzes
                </button>
                <button className="btn btn-primary" onClick={() => startQuiz(activeQuiz)}>
                  <RotateCcw size={16} />
                  Retry Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page page-container">
      <div className="content-wrapper" style={{ paddingTop: '88px', paddingBottom: '40px' }}>
        {/* Header */}
        <div className="notes-header animate-fade-in-up">
          <div>
            <h1 className="page-title">Quizzes</h1>
            <p className="page-subtitle">Test your knowledge with AI-generated quizzes</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowGenModal(true)}>
            <Zap size={18} />
            Generate Quiz
          </button>
        </div>

        {/* Quiz Grid */}
        <div className="quiz-grid stagger">
          {loading && <p>Loading quizzes...</p>}
          {!loading && quizzes.length === 0 && <p style={{ color: '#9ca3af' }}>No quizzes yet. Generate one!</p>}
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="quiz-card glass-card animate-fade-in-up">
              <div className="quiz-card-icon">{quiz.icon}</div>
              <div className="quiz-card-content">
                <div className="quiz-card-top">
                  <span className={`badge ${quiz.difficulty === 'Beginner' ? 'badge-success' : quiz.difficulty === 'Intermediate' ? 'badge-warning' : 'badge-error'}`}>
                    {quiz.difficulty}
                  </span>
                  {quiz.completed && quiz.score !== null && (
                    <span className="badge badge-primary">{quiz.score}%</span>
                  )}
                </div>
                <h3 className="quiz-card-title">{quiz.title}</h3>
                <div className="quiz-card-meta">
                  <span>
                    <BrainCircuit size={14} />
                    {quiz.questionsCount} questions
                  </span>
                  <span>
                    <Clock size={14} />
                    {quiz.duration}
                  </span>
                </div>
              </div>
              <button
                className={`btn ${quiz.completed ? 'btn-secondary' : 'btn-primary'} btn-sm quiz-card-btn`}
                onClick={() => startQuiz(quiz)}
              >
                {quiz.completed ? 'Retake' : 'Start'}
                <ChevronRight size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Generate Quiz Modal */}
        {showGenModal && (
          <div className="modal-overlay" onClick={() => setShowGenModal(false)}>
            <div className="modal-content glass-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', width: '90%', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Zap style={{ color: '#a855f7' }} />
                <h3 style={{ margin: 0 }}>Generate New Quiz</h3>
              </div>
              <p style={{ color: '#9ca3af', marginBottom: '16px', fontSize: '14px' }}>Enter any topic or paste notes below, and AI will generate a 5-question multiple choice quiz.</p>
              <input
                className="input"
                placeholder="E.g., World War II, React Hooks, Calculus..."
                value={genTopic}
                onChange={(e) => setGenTopic(e.target.value)}
                style={{ marginBottom: '24px' }}
                disabled={genLoading}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button className="btn btn-ghost" onClick={() => setShowGenModal(false)} disabled={genLoading}>Cancel</button>
                <button className="btn btn-primary" onClick={handleGenerateQuiz} disabled={genLoading || !genTopic.trim()}>
                  {genLoading ? 'Generating...' : 'Generate AI Quiz'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
