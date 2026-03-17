import React, { useState } from 'react';
import axios from 'axios';
import { Alert, Button, Card, Container, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/ServiceScreens.css';
import { setStoredUser } from '../utils/auth';

const SIGN_IN_API_URL = 'http://localhost:8000/api/auth/sign-in/';

const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.data?.errors) {
    return Object.values(error.response.data.errors).flat().join(' ');
  }

  if (error.message === 'Network Error') {
    return 'Unable to connect to the backend. Make sure Django is running on http://localhost:8000.';
  }

  return 'Sign in failed. Please try again.';
};

function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(SIGN_IN_API_URL, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setStoredUser(response.data.user);
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="service-page py-5">
      <Container>
        <Card className="service-box border-0 mx-auto" style={{ maxWidth: '32rem' }}>
          <Card.Body className="p-4 p-md-5">
            <h1 className="h3 mb-3">Sign In</h1>
            <p className="text-body-secondary mb-4">
              Use your email and password to access your account.
            </p>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </Form.Group>

              <div className="d-grid gap-3">
                <Button type="submit" variant="outline-dark" className="rounded-0" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
                <div className="text-center text-body-secondary">
                  No account yet? <Link to="/sign-up">Register here</Link>
                </div>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default SignIn;
