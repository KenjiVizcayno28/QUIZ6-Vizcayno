import React, { useState } from 'react';
import DonationForm from '../components/DonationForm';
import PayPalCheckout from '../components/PayPalCheckout';
import '../styles/PaymentScreen.css';

const PaymentScreen = () => {
  const [paymentData, setPaymentData] = useState(null);

  const handlePaymentSuccess = (data) => {
    setPaymentData(data);
  };

  const handleReset = () => {
    setPaymentData(null);
  };

  return (
    <div className="home-screen">
      <header className="header">
        <h1>Donation Platform</h1>
        <p>Support us with a donation</p>
      </header>

      <main className="main-content">
        {!paymentData ? (
          <DonationForm onPaymentSuccess={handlePaymentSuccess} />
        ) : (
          <div>
            <PayPalCheckout paymentData={paymentData} />
            <button onClick={handleReset} className="back-btn">
              Back to Form
            </button>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>&copy; 2024 Donation Platform. Powered by PayPal.</p>
      </footer>
    </div>
  );
};

export default PaymentScreen;