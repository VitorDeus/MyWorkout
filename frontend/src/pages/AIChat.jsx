import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import './AIChat.css';

const AIChat = () => {
  const { t } = useTranslation();
  const { isPremium } = useAuth();
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      let result;
      if (isPremium) {
        // Premium users get intelligent routing to specialized agents
        result = await api.ai.getAdvice(question);
      } else {
        // Free users get simple Q&A with Personal Trainer only
        result = await api.ai.simpleQuestion(question);
      }
      
      setResponse(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-chat">
      <div className="ai-chat-header">
        <h1>🤖 {t('ai_coach')}</h1>
        <p>{isPremium ? t('ai_premium_desc') : t('ai_free_desc')}</p>
      </div>

      <form onSubmit={handleSubmit} className="ai-chat-form">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t('ai_question_placeholder')}
          rows={4}
          disabled={loading}
        />
        
        <button type="submit" disabled={loading || !question.trim()}>
          {loading ? t('ai_thinking') : t('ai_ask')}
        </button>
      </form>

      {error && (
        <div className="ai-chat-error">
          <p>❌ {error}</p>
        </div>
      )}

      {response && (
        <div className="ai-chat-response">
          <div className="response-header">
            <h3>{isPremium ? '🎯 ' + t('ai_response') : '🏋️ Personal Trainer'}</h3>
          </div>
          
          {isPremium && response.agents ? (
            // Multiple agent responses
            <div className="multi-agent-response">
              {response.agents.map((agent, index) => (
                <div key={index} className="agent-response">
                  <div className="agent-header">
                    <span className="agent-icon">{agent.icon}</span>
                    <span className="agent-name">{agent.name}</span>
                  </div>
                  <div className="agent-content">
                    {agent.response}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Single agent response
            <div className="single-agent-response">
              <p>{response.response || response.answer}</p>
            </div>
          )}

          {!isPremium && (
            <div className="upgrade-prompt">
              <p>💎 {t('ai_upgrade_prompt')}</p>
              <a href="/premium" className="upgrade-link">{t('upgrade_to_premium')}</a>
            </div>
          )}
        </div>
      )}

      {!isPremium && (
        <div className="ai-features-locked">
          <h3>🔒 {t('premium_features')}</h3>
          <ul>
            <li>🏋️ Personal Trainer Agent</li>
            <li>🍎 Nutrition Coach Agent</li>
            <li>💪 Recovery Coach Agent</li>
            <li>📊 Performance Analyst Agent</li>
            <li>🧠 Motivation Coach Agent</li>
          </ul>
          <a href="/premium" className="btn-primary">{t('unlock_all_agents')}</a>
        </div>
      )}
    </div>
  );
};

export default AIChat;
