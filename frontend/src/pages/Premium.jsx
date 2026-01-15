import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Premium.css'

const Premium = () => {
  const { t } = useTranslation()
  const { isPremium, upgradeToPremium } = useAuth()
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState('annual')

  const handleUpgrade = () => {
    upgradeToPremium()
    navigate('/dashboard')
  }

  const plans = [
    {
      id: 'monthly',
      name: t('premium.monthly'),
      price: 9.99,
      period: t('premium.month'),
      savings: null,
      popular: false
    },
    {
      id: 'annual',
      name: t('premium.annual'),
      price: 79.99,
      period: t('premium.year'),
      savings: t('premium.save'),
      popular: true
    },
    {
      id: 'lifetime',
      name: t('premium.lifetime'),
      price: 199.99,
      period: t('premium.oneTime'),
      savings: t('premium.bestValue'),
      popular: false
    }
  ]

  const features = [
    { icon: '🤖', title: 'AI Workout Coach', description: 'Get personalized recommendations powered by AI', premium: true },
    { icon: '📊', title: 'Advanced Analytics', description: 'Detailed insights into your progress and performance', premium: true },
    { icon: '🎯', title: 'Custom Training Plans', description: 'Personalized programs tailored to your goals', premium: true },
    { icon: '🍎', title: 'Nutrition Tracking', description: 'Track calories, macros, and meal plans', premium: true },
    { icon: '👨‍🏫', title: 'Expert Programs', description: 'Access exclusive workouts from professional trainers', premium: true },
    { icon: '📹', title: 'Video Tutorials', description: 'HD exercise demonstrations and form guides', premium: true },
    { icon: '🏆', title: 'Challenges & Leaderboards', description: 'Compete with others and stay motivated', premium: true },
    { icon: '💬', title: 'Priority Support', description: '24/7 customer support from fitness experts', premium: true },
    { icon: '📱', title: 'Offline Mode', description: 'Download workouts for offline access', premium: true },
    { icon: '🔄', title: 'Apple Health & Google Fit', description: 'Sync with your favorite health apps', premium: true },
    { icon: '📈', title: 'Progress Photos', description: 'Track visual progress with photo comparisons', premium: true },
    { icon: '🎨', title: 'Custom Themes', description: 'Personalize your app experience', premium: true }
  ]

  if (isPremium) {
    return (
      <div className="premium-page">
        <div className="container">
          <div className="premium-active">
            <div className="premium-icon">⭐</div>
            <h1>{t('premium.youArePremium')}</h1>
            <p>{t('premium.thankYou')}</p>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
              {t('premium.goToDashboard')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="premium-page">
      <div className="container">
        <div className="premium-hero">
          <h1>{t('premium.title')}</h1>
          <p>{t('premium.subtitle')}</p>
        </div>

        <div className="plans-section">
          <div className="plans-grid">
            {plans.map(plan => (
              <div 
                key={plan.id}
                className={`plan-card ${selectedPlan === plan.id ? 'selected' : ''} ${plan.popular ? 'popular' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && <div className="popular-badge">{t('premium.mostPopular')}</div>}
                <h3>{plan.name}</h3>
                <div className="plan-price">
                  <span className="price-amount">${plan.price}</span>
                  <span className="price-period">{plan.period}</span>
                </div>
                {plan.savings && <div className="plan-savings">{plan.savings}</div>}
                <div className="plan-features-list">
                  <div className="plan-feature">{t('premium.allFeatures')}</div>
                  <div className="plan-feature">{t('premium.cancelAnytime')}</div>
                  <div className="plan-feature">{t('premium.moneyBack')}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="upgrade-action">
            <button className="btn btn-primary btn-lg" onClick={handleUpgrade}>
              {t('premium.upgrade')}
            </button>
            <p className="secure-payment">{t('premium.securePayment')}</p>
          </div>
        </div>

        <div className="features-section">
          <h2>{t('premium.everythingIncluded')}</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-item">
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-content">
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="testimonials-section">
          <h2>{t('premium.testimonials')}</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
              <p>"The AI coach feature is amazing! It's like having a personal trainer in my pocket."</p>
              <div className="testimonial-author">
                <strong>Sarah J.</strong>
                <span>Premium Member</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
              <p>"I've seen incredible progress since upgrading. The custom plans are worth every penny."</p>
              <div className="testimonial-author">
                <strong>Mike T.</strong>
                <span>Premium Member</span>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
              <p>"Best fitness app I've used. The nutrition tracking has been a game changer for me."</p>
              <div className="testimonial-author">
                <strong>Emma L.</strong>
                <span>Premium Member</span>
              </div>
            </div>
          </div>
        </div>

        <div className="faq-section">
          <h2>{t('premium.faq')}</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>Can I cancel anytime?</h4>
              <p>Yes! You can cancel your subscription at any time with no questions asked.</p>
            </div>
            <div className="faq-item">
              <h4>What payment methods do you accept?</h4>
              <p>We accept all major credit cards, debit cards, and PayPal through our secure payment processor.</p>
            </div>
            <div className="faq-item">
              <h4>Is there a money-back guarantee?</h4>
              <p>Yes, we offer a 30-day money-back guarantee. If you're not satisfied, we'll refund you in full.</p>
            </div>
            <div className="faq-item">
              <h4>Will I lose my data if I downgrade?</h4>
              <p>No, all your workout history and progress will be saved. You'll just lose access to premium features.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Premium
