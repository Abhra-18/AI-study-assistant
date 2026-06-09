import { useState, useRef, useEffect } from 'react';
import { dummyChatMessages } from '../../data/dummyData';
import {
  Send, Bot, User, Sparkles, Copy, ThumbsUp,
  ThumbsDown, RotateCcw, Paperclip, Mic, Loader2
} from 'lucide-react';
import './Chat.css';

const suggestedPrompts = [
  'Explain backpropagation in neural networks',
  'What are the key differences between TCP and UDP?',
  'Help me understand quantum entanglement',
  'Summarize the key concepts of organic chemistry',
];

export default function Chat() {
  const [messages, setMessages] = useState(dummyChatMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text) => {
    const content = text || input.trim();
    if (!content) return;

    const userMsg = {
      id: String(Date.now()),
      role: 'user',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      // Map messages to format expected by backend: { sender: 'user'|'assistant', text: '...' }
      const history = newMessages.map(msg => ({
        sender: msg.role,
        text: msg.content
      }));

      const token = localStorage.getItem('studyai-token');
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ prompt: content, history: history.slice(0, -1) })
      });

      const data = await res.json();
      
      const aiMsg = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: data.reply || data.message || 'Error occurred.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: 'Failed to connect to AI server. Please make sure your API key is set.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className="chat-page page-container">
      <div className="chat-layout">
        {/* Chat Main */}
        <div className="chat-main">
          {/* Messages */}
          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="chat-welcome animate-fade-in-up">
                <div className="chat-welcome-icon">
                  <Sparkles size={32} />
                </div>
                <h2>AI Study Assistant</h2>
                <p>Ask me anything about your studies. I'm here to help!</p>

                <div className="suggested-prompts">
                  {suggestedPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      className="suggested-prompt glass-card"
                      onClick={() => sendMessage(prompt)}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.role}`}>
                <div className="message-avatar">
                  {msg.role === 'assistant' ? (
                    <div className="avatar-bot">
                      <Bot size={18} />
                    </div>
                  ) : (
                    <div className="avatar">
                      <User size={18} />
                    </div>
                  )}
                </div>
                <div className="message-body">
                  <div className="message-header">
                    <span className="message-sender">
                      {msg.role === 'assistant' ? 'StudyAI' : 'You'}
                    </span>
                    <span className="message-time">{msg.timestamp}</span>
                  </div>
                  <div className="message-content">
                    {msg.content.split('\n').map((line, i) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <p key={i}><strong>{line.replace(/\*\*/g, '')}</strong></p>;
                      }
                      if (line.startsWith('- ')) {
                        return <p key={i} className="message-list-item">• {line.substring(2)}</p>;
                      }
                      if (line.trim() === '') return <br key={i} />;
                      // Handle inline bold
                      const parts = line.split(/(\*\*.*?\*\*)/g);
                      return (
                        <p key={i}>
                          {parts.map((part, j) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return <strong key={j}>{part.replace(/\*\*/g, '')}</strong>;
                            }
                            return part;
                          })}
                        </p>
                      );
                    })}
                  </div>
                  {msg.role === 'assistant' && (
                    <div className="message-actions">
                      <button className="msg-action-btn" onClick={() => copyMessage(msg.content)} title="Copy">
                        <Copy size={14} />
                      </button>
                      <button className="msg-action-btn" title="Good response">
                        <ThumbsUp size={14} />
                      </button>
                      <button className="msg-action-btn" title="Bad response">
                        <ThumbsDown size={14} />
                      </button>
                      <button className="msg-action-btn" title="Regenerate">
                        <RotateCcw size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-message assistant">
                <div className="message-avatar">
                  <div className="avatar-bot">
                    <Bot size={18} />
                  </div>
                </div>
                <div className="message-body">
                  <div className="typing-indicator">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="chat-input-area">
            {messages.length === 0 && (
              <div className="chat-suggestions-bar">
                {suggestedPrompts.slice(0, 2).map((prompt, i) => (
                  <button
                    key={i}
                    className="btn btn-secondary btn-sm"
                    onClick={() => sendMessage(prompt)}
                  >
                    <Sparkles size={12} />
                    {prompt.substring(0, 35)}...
                  </button>
                ))}
              </div>
            )}
            <div className="chat-input-wrapper glass-strong">
              <button className="btn btn-icon btn-ghost" title="Attach file">
                <Paperclip size={18} />
              </button>
              <textarea
                ref={inputRef}
                className="chat-input"
                placeholder="Ask StudyAI anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
              />
              <button className="btn btn-icon btn-ghost" title="Voice input">
                <Mic size={18} />
              </button>
              <button
                className="btn btn-primary btn-icon send-btn"
                onClick={() => sendMessage()}
                disabled={!input.trim() || isTyping}
              >
                {isTyping ? <Loader2 size={18} className="spinning" /> : <Send size={18} />}
              </button>
            </div>
            <p className="chat-disclaimer">
              StudyAI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
