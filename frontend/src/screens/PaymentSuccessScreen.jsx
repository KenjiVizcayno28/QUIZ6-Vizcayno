import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PaymentSuccessScreen.css';

const PaymentSuccessScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="success-screen">
      <div className="success-container">
        <div className="success-icon">✓</div>
        <h1>Payment Successful!</h1>
        <p>Thank you for your generous donation.</p>
        <p>A confirmation email has been sent to you.</p>
        <button onClick={() => navigate('/')} className="home-btn">
          Return Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessScreen;