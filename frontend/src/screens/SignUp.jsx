import React, { useState } from 'react';
import axios from 'axios';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/ServiceScreens.css';

const SIGN_UP_API_URL = 'http://localhost:8000/api/auth/sign-up/';

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

  return 'Registration failed. Please try again.';
};

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    phone_number: '',
    first_name: '',
    last_name: '',
    location: 'HAU',
    gender: 'male',
    password: '',
    confirm_password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
    setSuccessMessage('');

    try {
      const response = await axios.post(SIGN_UP_API_URL, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setSuccessMessage(`${response.data.message} Your account type is User.`);
      setTimeout(() => {
        navigate('/sign-in');
      }, 1200);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="service-page py-5">
      <Container>
        <Card className="service-box border-0 mx-auto" style={{ maxWidth: '48rem' }}>
          <Card.Body className="p-4 p-md-5">
            <h1 className="h3 mb-3">Register</h1>
            <p className="text-body-secondary mb-4">
              New registrations are automatically created with the User account level.
            </p>
            {error && <Alert variant="danger">{error}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="phone_number">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="location">
                    <Form.Label>Location</Form.Label>
                    <Form.Control type="text" name="location" value={formData.location} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="first_name">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="last_name">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="gender">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select name="gender" value={formData.gender} onChange={handleChange} required>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="confirm_password">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} required />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-grid gap-3 mt-4">
                <Button type="submit" variant="outline-dark" className="rounded-0" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
                <div className="text-center text-body-secondary">
                  Already have an account? <Link to="/sign-in">Sign in here</Link>
                </div>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default SignUp;
