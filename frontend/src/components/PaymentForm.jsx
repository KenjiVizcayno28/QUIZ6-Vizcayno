import React, { useState } from 'react';
import axios from 'axios';
import '../styles/DonationForm.css';

const PaymentForm = ({ onPaymentSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    amount: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.data.status === 'success') {
        onPaymentSuccess(response.data);
      } else {
        setError('Payment creation failed. Please try again.');
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(JSON.stringify(err.response.data.errors));
      } else if (err.message === 'Network Error') {
        setError('Unable to connect to server. Make sure the backend is running on http://localhost:8000');
      } else {
        setError(err.message || 'Failed to process payment');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="donation-form-container">
      <h2>Fill up this form</h2>
      {error && <div className="error-message">{JSON.stringify(error)}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Juan Dela Cruz"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="juan@example.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount"> Amount ($)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="0.01"
            step="0.01"
            placeholder="10.00"
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Processing...' : 'Proceed to PayPal'}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;