import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Camera, Edit3, Save, Mail, Calendar, Award,
  BookOpen, BrainCircuit, Clock, Flame, Bell,
  Shield, Palette, Globe, LogOut, ChevronRight, Crown
} from 'lucide-react';
import './Profile.css';

export default function Profile() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Alex Johnson',
    email: user?.email || 'alex@studyai.com',
    bio: 'Passionate CS student exploring AI and machine learning.',
    university: 'MIT',
    major: 'Computer Science',
    year: '3rd Year',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: Edit3 },
    { id: 'stats', label: 'Statistics', icon: Award },
    { id: 'settings', label: 'Settings', icon: Shield },
  ];

  const stats = [
    { label: 'Notes Created', value: user?.stats?.notesCreated || 47, icon: BookOpen, color: '#6366f1' },
    { label: 'Quizzes Taken', value: user?.stats?.quizzesTaken || 23, icon: BrainCircuit, color: '#a855f7' },
    { label: 'Study Hours', value: user?.stats?.studyHours || 156, icon: Clock, color: '#22c55e' },
    { label: 'Day Streak', value: user?.stats?.streak || 12, icon: Flame, color: '#f59e0b' },
  ];

  const achievements = [
    { title: 'First Note', desc: 'Created your first study note', icon: '📝', unlocked: true },
    { title: 'Quiz Master', desc: 'Score 90%+ on 5 quizzes', icon: '🏆', unlocked: true },
    { title: 'Streak Lord', desc: 'Maintain a 7-day streak', icon: '🔥', unlocked: true },
    { title: 'AI Explorer', desc: 'Ask 50 questions to AI', icon: '🤖', unlocked: false },
    { title: 'Note Ninja', desc: 'Create 100 notes', icon: '⚡', unlocked: false },
    { title: 'Perfect Score', desc: 'Score 100% on any quiz', icon: '💯', unlocked: false },
  ];

  return (
    <div className="profile-page page-container">
      <div className="content-wrapper" style={{ paddingTop: '88px', paddingBottom: '40px' }}>
        {/* Profile Header */}
        <div className="profile-header glass-card animate-fade-in-up">
          <div className="profile-cover">
            <div className="profile-cover-gradient" />
          </div>
          <div className="profile-header-content">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                <div className="avatar-xl">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <button className="avatar-edit-btn">
                  <Camera size={14} />
                </button>
              </div>
              <div className="profile-info">
                <div className="profile-name-row">
                  <h1 className="profile-name">{formData.name}</h1>
                  <span className="badge badge-accent">
                    <Crown size={12} />
                    {user?.plan || 'Pro'}
                  </span>
                </div>
                <p className="profile-email">{formData.email}</p>
                <p className="profile-bio">{formData.bio}</p>
              </div>
            </div>
            <div className="profile-quick-stats">
              {stats.map((stat, i) => (
                <div key={i} className="quick-stat">
                  <span className="quick-stat-value">{stat.value}</span>
                  <span className="quick-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="profile-content animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {activeTab === 'profile' && (
            <div className="profile-form-section">
              <div className="glass-card" style={{ padding: '28px' }}>
                <div className="card-header">
                  <h2 className="card-title">Personal Information</h2>
                  <button
                    className={`btn btn-sm ${editing ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setEditing(!editing)}
                  >
                    {editing ? <><Save size={14} /> Save</> : <><Edit3 size={14} /> Edit</>}
                  </button>
                </div>
                <div className="form-grid">
                  <div className="input-group">
                    <label>Full Name</label>
                    <input
                      className="input"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      disabled={!editing}
                    />
                  </div>
                  <div className="input-group">
                    <label>Email</label>
                    <input
                      className="input"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      disabled={!editing}
                    />
                  </div>
                  <div className="input-group">
                    <label>University</label>
                    <input
                      className="input"
                      value={formData.university}
                      onChange={(e) => handleChange('university', e.target.value)}
                      disabled={!editing}
                    />
                  </div>
                  <div className="input-group">
                    <label>Major</label>
                    <input
                      className="input"
                      value={formData.major}
                      onChange={(e) => handleChange('major', e.target.value)}
                      disabled={!editing}
                    />
                  </div>
                  <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Bio</label>
                    <textarea
                      className="input"
                      value={formData.bio}
                      onChange={(e) => handleChange('bio', e.target.value)}
                      disabled={!editing}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="stats-section">
              {/* Stats Cards */}
              <div className="stats-grid">
                {stats.map((stat, i) => (
                  <div key={i} className="stat-card-lg glass-card">
                    <div className="stat-card-icon" style={{ background: `${stat.color}18`, color: stat.color }}>
                      <stat.icon size={24} />
                    </div>
                    <span className="stat-card-value">{stat.value}</span>
                    <span className="stat-card-label">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Achievements */}
              <div className="glass-card" style={{ padding: '28px' }}>
                <h2 className="card-title" style={{ marginBottom: '20px' }}>
                  <Award size={18} />
                  Achievements
                </h2>
                <div className="achievements-grid">
                  {achievements.map((achievement, i) => (
                    <div
                      key={i}
                      className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                    >
                      <span className="achievement-icon">{achievement.icon}</span>
                      <div className="achievement-info">
                        <span className="achievement-title">{achievement.title}</span>
                        <span className="achievement-desc">{achievement.desc}</span>
                      </div>
                      {!achievement.unlocked && <span className="achievement-lock">🔒</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-section">
              <div className="glass-card" style={{ padding: '28px' }}>
                <h2 className="card-title" style={{ marginBottom: '20px' }}>
                  <Shield size={18} />
                  Preferences
                </h2>
                <div className="settings-list">
                  <div className="settings-item">
                    <div className="settings-item-info">
                      <Palette size={18} />
                      <div>
                        <span className="settings-item-title">Dark Mode</span>
                        <span className="settings-item-desc">Toggle between light and dark themes</span>
                      </div>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
                      <span className="toggle-slider" />
                    </label>
                  </div>
                  <div className="settings-item">
                    <div className="settings-item-info">
                      <Bell size={18} />
                      <div>
                        <span className="settings-item-title">Notifications</span>
                        <span className="settings-item-desc">Receive study reminders and updates</span>
                      </div>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider" />
                    </label>
                  </div>
                  <div className="settings-item">
                    <div className="settings-item-info">
                      <Globe size={18} />
                      <div>
                        <span className="settings-item-title">Language</span>
                        <span className="settings-item-desc">Select your preferred language</span>
                      </div>
                    </div>
                    <span className="settings-value">English <ChevronRight size={14} /></span>
                  </div>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '28px' }}>
                <h2 className="card-title" style={{ marginBottom: '20px', color: '#ef4444' }}>
                  Danger Zone
                </h2>
                <div className="settings-list">
                  <div className="settings-item">
                    <div className="settings-item-info">
                      <LogOut size={18} />
                      <div>
                        <span className="settings-item-title">Sign Out</span>
                        <span className="settings-item-desc">Sign out from your account</span>
                      </div>
                    </div>
                    <button className="btn btn-danger btn-sm" onClick={logout}>
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
