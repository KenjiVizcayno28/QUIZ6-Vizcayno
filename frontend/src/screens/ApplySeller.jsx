import React, { useState } from 'react';
import axios from 'axios';
import { Alert, Button, Card, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/ServiceScreens.css';
import { getStoredUser, setStoredUser } from '../utils/auth';

const APPLY_SELLER_API_URL = 'http://localhost:8000/api/auth/apply-seller/';

function ApplySeller() {
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleApply = async () => {
    if (!currentUser) {
      setError('You must sign in before applying as a seller.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.post(
        APPLY_SELLER_API_URL,
        { email: currentUser.email },
        { headers: { 'Content-Type': 'application/json' } }
      );

      setStoredUser(response.data.user);
      setCurrentUser(response.data.user);
      setSuccessMessage(response.data.message);
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        setError(Object.values(err.response.data.errors).flat().join(' '));
      } else if (err.message === 'Network Error') {
        setError('Unable to connect to the backend. Make sure Django is running on http://localhost:8000.');
      } else {
        setError('Seller application failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStatus = () => {
    if (!currentUser) {
      return (
        <Alert variant="warning" className="mb-4">
          You need an account first. <Link to="/sign-in">Sign in</Link> or <Link to="/sign-up">register</Link>.
        </Alert>
      );
    }

    if (currentUser.user_type === 'admin') {
      return <Alert variant="secondary" className="mb-4">Admin accounts do not need to apply as sellers.</Alert>;
    }

    if (currentUser.user_type === 'seller') {
      return (
        <Alert variant="success" className="mb-4">
          Your seller account is already approved.
          {currentUser.merchant_id ? ` Merchant ID: ${currentUser.merchant_id}` : ''}
        </Alert>
      );
    }

    if (currentUser.seller_application_status === 'pending') {
      return <Alert variant="info" className="mb-4">Your seller application is pending admin approval.</Alert>;
    }

    if (currentUser.seller_application_status === 'declined') {
      return (
        <Alert variant="danger" className="mb-4">
          Your previous seller application was declined.
          {currentUser.seller_application_reason ? ` Reason: ${currentUser.seller_application_reason}` : ''}
        </Alert>
      );
    }

    return null;
  };

  return (
    <div className="service-page py-5">
      <Container>
        <Card className="service-box border-0 mx-auto" style={{ maxWidth: '42rem' }}>
          <Card.Body className="p-4 p-md-5">
            <h1 className="h3 mb-3">Apply as Seller</h1>
            <p className="text-body-secondary mb-4">
              Any registered user can apply to become a seller. Approval is subject to admin review.
            </p>
            {renderStatus()}
            {error && <Alert variant="danger">{error}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            <div className="d-grid gap-3">
              <Button
                variant="outline-dark"
                className="rounded-0"
                onClick={handleApply}
                disabled={!currentUser || currentUser.user_type !== 'user' || currentUser.seller_application_status === 'pending' || loading}
              >
                {loading ? 'Submitting Application...' : 'Apply as Seller'}
              </Button>
              <Button as={Link} to="/" variant="outline-dark" className="rounded-0">
                Back to Services
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default ApplySeller;
