import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dummyDashboardStats } from '../../data/dummyData';
import {
  BookOpen, BrainCircuit, MessageSquare, Clock,
  Flame, TrendingUp, ArrowRight, Plus, Zap
} from 'lucide-react';
import './Dashboard.css';

const statCards = [
  { label: 'Total Notes', value: dummyDashboardStats.totalNotes, icon: BookOpen, color: '#6366f1', to: '/notes' },
  { label: 'Quizzes Taken', value: dummyDashboardStats.quizzesTaken, icon: BrainCircuit, color: '#a855f7', to: '/quiz' },
  { label: 'Study Hours', value: dummyDashboardStats.studyHours, icon: Clock, color: '#22c55e', to: '#' },
  { label: 'Day Streak', value: dummyDashboardStats.currentStreak, icon: Flame, color: '#f59e0b', to: '#' },
];

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard-page page-container">
      <div className="content-wrapper" style={{ paddingTop: '88px', paddingBottom: '40px' }}>
        {/* Welcome Header */}
        <div className="dash-header animate-fade-in-up">
          <div>
            <h1 className="dash-greeting">
              Welcome back, <span className="gradient-text">{user?.name || 'Student'}</span> 👋
            </h1>
            <p className="dash-subtitle">Here's your learning progress overview</p>
          </div>
          <div className="dash-header-actions">
            <Link to="/notes" className="btn btn-secondary btn-sm">
              <Plus size={16} />
              New Note
            </Link>
            <Link to="/chat" className="btn btn-primary btn-sm">
              <MessageSquare size={16} />
              AI Chat
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="dash-stats stagger">
          {statCards.map((stat, i) => (
            <Link key={i} to={stat.to} className="dash-stat-card glass-card animate-fade-in-up" style={{ textDecoration: 'none' }}>
              <div className="stat-icon" style={{ background: `${stat.color}18`, color: stat.color }}>
                <stat.icon size={22} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="dash-grid">
          {/* Weekly Progress Chart */}
          <div className="dash-chart glass-card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="card-header">
              <h2 className="card-title">
                <TrendingUp size={18} />
                Weekly Progress
              </h2>
              <span className="badge badge-success">+12%</span>
            </div>
            <div className="chart-container">
              <div className="bar-chart">
                {dummyDashboardStats.weeklyProgress.map((value, i) => (
                  <div key={i} className="bar-column">
                    <div className="bar-wrapper">
                      <div
                        className="bar"
                        style={{
                          height: `${value}%`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    </div>
                    <span className="bar-label">{dayLabels[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="dash-activity glass-card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="card-header">
              <h2 className="card-title">
                <Zap size={18} />
                Recent Activity
              </h2>
              <button className="btn btn-ghost btn-sm">View All</button>
            </div>
            <div className="activity-list">
              {dummyDashboardStats.recentActivity.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <span className="activity-icon">{activity.icon}</span>
                  <div className="activity-info">
                    <span className="activity-title">{activity.title}</span>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subject Progress */}
        <div className="dash-subjects glass-card animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="card-header">
            <h2 className="card-title">
              <BookOpen size={18} />
              Subject Progress
            </h2>
          </div>
          <div className="subjects-list">
            {dummyDashboardStats.subjects.map((subject, i) => (
              <div key={i} className="subject-item">
                <div className="subject-header">
                  <span className="subject-name">{subject.name}</span>
                  <span className="subject-percent">{subject.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${subject.progress}%`,
                      background: subject.color,
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dash-quick-actions animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <Link to="/notes" className="quick-action glass-card">
            <BookOpen size={24} />
            <span>Create Note</span>
            <ArrowRight size={16} className="quick-action-arrow" />
          </Link>
          <Link to="/quiz" className="quick-action glass-card">
            <BrainCircuit size={24} />
            <span>Start Quiz</span>
            <ArrowRight size={16} className="quick-action-arrow" />
          </Link>
          <Link to="/chat" className="quick-action glass-card">
            <MessageSquare size={24} />
            <span>Ask AI</span>
            <ArrowRight size={16} className="quick-action-arrow" />
          </Link>
        </div>
      </div>
    </div>
  );
}
