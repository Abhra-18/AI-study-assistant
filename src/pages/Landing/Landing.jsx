import { Link } from 'react-router-dom';
import {
  Sparkles, BookOpen, BrainCircuit, MessageSquare,
  Zap, Shield, Globe, ChevronRight, ArrowRight,
  Star, Users, TrendingUp, CheckCircle2
} from 'lucide-react';
import './Landing.css';

const features = [
  {
    icon: BookOpen,
    title: 'Smart Notes',
    description: 'AI-powered note-taking that organizes, summarizes, and connects your study materials automatically.',
    color: '#6366f1',
  },
  {
    icon: BrainCircuit,
    title: 'Adaptive Quizzes',
    description: 'Personalized quizzes that adapt to your knowledge level and focus on areas you need to improve.',
    color: '#a855f7',
  },
  {
    icon: MessageSquare,
    title: 'AI Tutor Chat',
    description: 'Get instant explanations, solve problems, and explore concepts with your personal AI study companion.',
    color: '#22c55e',
  },
  {
    icon: TrendingUp,
    title: 'Progress Analytics',
    description: 'Track your learning journey with detailed insights, streaks, and performance metrics.',
    color: '#f59e0b',
  },
  {
    icon: Zap,
    title: 'Flashcard Generator',
    description: 'Automatically generate flashcards from your notes and textbooks for efficient spaced repetition.',
    color: '#ef4444',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and never shared. Study with confidence knowing your work is protected.',
    color: '#06b6d4',
  },
];

const stats = [
  { number: '50K+', label: 'Active Students' },
  { number: '2M+', label: 'Notes Created' },
  { number: '500K+', label: 'Quizzes Taken' },
  { number: '98%', label: 'Satisfaction' },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Computer Science, MIT',
    content: 'StudyAI transformed how I prepare for exams. The AI-generated quizzes helped me identify weak areas I didn\'t even know I had.',
    rating: 5,
  },
  {
    name: 'Marcus Williams',
    role: 'Pre-Med, Stanford',
    content: 'The chat feature is like having a tutor available 24/7. It explains complex biochemistry concepts in ways I can actually understand.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Engineering, IIT Delhi',
    content: 'My grades improved by two letter grades after using StudyAI for just one semester. The smart notes feature is incredibly powerful.',
    rating: 5,
  },
];

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: ['5 Notes', '3 Quizzes/month', 'Basic AI Chat', 'Community Support'],
    cta: 'Start Free',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/month',
    features: ['Unlimited Notes', 'Unlimited Quizzes', 'Advanced AI Chat', 'Priority Support', 'Export & Sharing', 'Progress Analytics'],
    cta: 'Get Pro',
    popular: true,
  },
  {
    name: 'Team',
    price: '$19',
    period: '/month',
    features: ['Everything in Pro', 'Team Collaboration', 'Shared Workspaces', 'Admin Dashboard', 'API Access', 'Custom Branding'],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function Landing() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-effects">
          <div className="hero-gradient-1" />
          <div className="hero-gradient-2" />
          <div className="hero-grid" />
        </div>

        <div className="hero-content content-wrapper">
          <div className="hero-badge animate-fade-in-up">
            <Sparkles size={14} />
            <span>AI-Powered Learning Platform</span>
          </div>

          <h1 className="hero-title animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Study Smarter with
            <br />
            <span className="gradient-text">Artificial Intelligence</span>
          </h1>

          <p className="hero-subtitle animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Transform your study sessions with AI-powered notes, adaptive quizzes,
            and a personal tutor that understands your learning style.
          </p>

          <div className="hero-actions animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/signup" className="btn btn-primary btn-lg">
              Start Learning Free
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Watch Demo
              <ChevronRight size={18} />
            </Link>
          </div>

          <div className="hero-stats animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {stats.map((stat, i) => (
              <div key={i} className="hero-stat">
                <span className="hero-stat-number">{stat.number}</span>
                <span className="hero-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Visual */}
        <div className="hero-visual animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="hero-dashboard-preview glass-card">
            <div className="preview-header">
              <div className="preview-dots">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
              </div>
              <span className="preview-title">StudyAI Dashboard</span>
            </div>
            <div className="preview-content">
              <div className="preview-sidebar">
                <div className="preview-nav-item active">
                  <div className="preview-icon" />
                  <div className="preview-text-sm" />
                </div>
                <div className="preview-nav-item">
                  <div className="preview-icon" />
                  <div className="preview-text-sm" />
                </div>
                <div className="preview-nav-item">
                  <div className="preview-icon" />
                  <div className="preview-text-sm" />
                </div>
              </div>
              <div className="preview-main">
                <div className="preview-cards">
                  <div className="preview-stat-card" style={{ '--card-color': '#6366f1' }}>
                    <div className="preview-text-lg" />
                    <div className="preview-text-sm" />
                  </div>
                  <div className="preview-stat-card" style={{ '--card-color': '#a855f7' }}>
                    <div className="preview-text-lg" />
                    <div className="preview-text-sm" />
                  </div>
                  <div className="preview-stat-card" style={{ '--card-color': '#22c55e' }}>
                    <div className="preview-text-lg" />
                    <div className="preview-text-sm" />
                  </div>
                </div>
                <div className="preview-chart">
                  <div className="chart-bars">
                    {[65, 80, 45, 90, 70, 85, 60].map((h, i) => (
                      <div key={i} className="chart-bar" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section section" id="features">
        <div className="content-wrapper">
          <div className="section-header">
            <span className="section-tag">Features</span>
            <h2 className="section-title">
              Everything you need to
              <span className="gradient-text"> ace your studies</span>
            </h2>
            <p className="section-subtitle">
              Powerful tools designed to make learning more effective, efficient, and enjoyable.
            </p>
          </div>

          <div className="features-grid stagger">
            {features.map((feature, i) => (
              <div key={i} className="feature-card glass-card animate-fade-in-up">
                <div className="feature-icon" style={{ background: `${feature.color}20`, color: feature.color }}>
                  <feature.icon size={24} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section section">
        <div className="content-wrapper">
          <div className="section-header">
            <span className="section-tag">Testimonials</span>
            <h2 className="section-title">
              Loved by <span className="gradient-text">students worldwide</span>
            </h2>
          </div>

          <div className="testimonials-grid stagger">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card glass-card animate-fade-in-up">
                <div className="testimonial-stars">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} fill="#fbbf24" color="#fbbf24" />
                  ))}
                </div>
                <p className="testimonial-content">"{t.content}"</p>
                <div className="testimonial-author">
                  <div className="avatar">{t.name.charAt(0)}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing-section section" id="pricing">
        <div className="content-wrapper">
          <div className="section-header">
            <span className="section-tag">Pricing</span>
            <h2 className="section-title">
              Simple, <span className="gradient-text">transparent pricing</span>
            </h2>
            <p className="section-subtitle">
              Start for free. Upgrade when you need more power.
            </p>
          </div>

          <div className="pricing-grid stagger">
            {pricingPlans.map((plan, i) => (
              <div
                key={i}
                className={`pricing-card glass-card animate-fade-in-up ${plan.popular ? 'popular' : ''}`}
              >
                {plan.popular && <div className="popular-badge">Most Popular</div>}
                <h3 className="pricing-name">{plan.name}</h3>
                <div className="pricing-price">
                  <span className="price">{plan.price}</span>
                  <span className="period">{plan.period}</span>
                </div>
                <ul className="pricing-features">
                  {plan.features.map((f, j) => (
                    <li key={j}>
                      <CheckCircle2 size={16} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/signup"
                  className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} btn-lg`}
                  style={{ width: '100%' }}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section section">
        <div className="content-wrapper">
          <div className="cta-card glass-strong">
            <div className="cta-bg-glow" />
            <h2 className="cta-title">
              Ready to transform your
              <span className="gradient-text"> learning journey?</span>
            </h2>
            <p className="cta-subtitle">
              Join 50,000+ students already using StudyAI to study smarter.
            </p>
            <Link to="/signup" className="btn btn-primary btn-lg">
              Get Started for Free
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="content-wrapper">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="navbar-brand" style={{ color: 'var(--text-primary)' }}>
                <div className="navbar-logo">
                  <Sparkles size={20} />
                </div>
                <span className="navbar-title">StudyAI</span>
              </div>
              <p className="footer-tagline">AI-powered learning for the modern student.</p>
            </div>
            <div className="footer-links-group">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#">Changelog</a>
            </div>
            <div className="footer-links-group">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Blog</a>
              <a href="#">Careers</a>
            </div>
            <div className="footer-links-group">
              <h4>Legal</h4>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Security</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 StudyAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
