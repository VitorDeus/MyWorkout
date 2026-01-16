import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import './PaymentSuccess.css';

function PaymentSuccess() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [planDetails, setPlanDetails] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        setStatus('error');
        return;
      }

      try {
        const response = await api.payments.verifySession(sessionId);
        setPlanDetails(response.data);
        setStatus('success');
      } catch (error) {
        console.error('Payment verification failed:', error);
        setStatus('error');
      }
    };

    verifyPayment();
  }, [searchParams]);

  const handleContinue = () => {
    navigate('/dashboard');
  };

  if (status === 'verifying') {
    return (
      <div className="payment-success-container">
        <div className="payment-success-card">
          <div className="spinner"></div>
          <h2>{t('payments.verifying')}</h2>
          <p>{t('payments.verifyingDesc')}</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="payment-success-container">
        <div className="payment-success-card">
          <div className="error-icon">❌</div>
          <h2>{t('payments.error')}</h2>
          <p>{t('payments.errorDesc')}</p>
          <button onClick={() => navigate('/premium')} className="btn-primary">
            {t('payments.tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-success-container">
      <div className="payment-success-card success">
        <div className="success-icon">🎉</div>
        <h1>{t('payments.successTitle')}</h1>
        <p>{t('payments.successDesc')}</p>
        
        {planDetails && (
          <div className="plan-details">
            <h3>{t('payments.planDetails')}</h3>
            <div className="detail-row">
              <span>{t('payments.plan')}:</span>
              <strong>{planDetails.plan.charAt(0).toUpperCase() + planDetails.plan.slice(1)}</strong>
            </div>
            {planDetails.expiresAt && (
              <div className="detail-row">
                <span>{t('payments.expiresAt')}:</span>
                <strong>{new Date(planDetails.expiresAt).toLocaleDateString()}</strong>
              </div>
            )}
            {!planDetails.expiresAt && (
              <div className="detail-row">
                <span>{t('payments.validity')}:</span>
                <strong>{t('payments.lifetime')}</strong>
              </div>
            )}
          </div>
        )}

        <div className="features-unlocked">
          <h3>{t('payments.featuresUnlocked')}</h3>
          <ul>
            <li>✅ {t('payments.feature1')}</li>
            <li>✅ {t('payments.feature2')}</li>
            <li>✅ {t('payments.feature3')}</li>
            <li>✅ {t('payments.feature4')}</li>
            <li>✅ {t('payments.feature5')}</li>
          </ul>
        </div>

        <button onClick={handleContinue} className="btn-primary btn-large">
          {t('payments.continueToDashboard')}
        </button>
      </div>
    </div>
  );
}

export default PaymentSuccess;
