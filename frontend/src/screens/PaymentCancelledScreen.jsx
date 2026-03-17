import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PaymentCancelledScreen.css';

const PaymentCancelledScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="cancelled-screen">
      <div className="cancelled-container">
        <div className="cancelled-icon">✕</div>
        <h1>Payment Cancelled</h1>
        <p>Your payment has been cancelled.</p>
        <p>You can try again whenever you're ready.</p>
        <button onClick={() => navigate('/')} className="home-btn">
          Return Home
        </button>
      </div>
    </div>
  );
};

export default PaymentCancelledScreen;